-- ============================================================================
-- STR Management — Initial Schema
-- 11 tables, 13 enums, RLS policies
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE client_status AS ENUM ('active', 'pending', 'inactive');
CREATE TYPE preferred_contact AS ENUM ('email', 'phone', 'text');
CREATE TYPE booking_status AS ENUM ('confirmed', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE booking_source AS ENUM ('hospitable', 'direct', 'airbnb', 'vrbo');
CREATE TYPE access_code_type AS ENUM ('guest', 'cleaner', 'maintenance', 'owner');
CREATE TYPE access_code_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE activity_type AS ENUM ('automated', 'manual', 'alert');
CREATE TYPE sensor_type AS ENUM ('noise_db', 'temperature', 'lock_heartbeat', 'utility_usage');
CREATE TYPE alert_severity AS ENUM ('warning', 'critical');
CREATE TYPE leak_status AS ENUM ('clear', 'critical');
CREATE TYPE valve_status AS ENUM ('open', 'closed');
CREATE TYPE lock_status AS ENUM ('online', 'offline');

-- ============================================================================
-- UTILITY: updated_at trigger function
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLES
-- ============================================================================

-- CLIENT (property owners)
CREATE TABLE client (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL,
  email             text        NOT NULL,
  phone             text        NOT NULL,
  join_date         date        NOT NULL DEFAULT CURRENT_DATE,
  status            client_status NOT NULL DEFAULT 'pending',
  preferred_contact preferred_contact NOT NULL DEFAULT 'email',
  notes             text        NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  archived_at       timestamptz
);

CREATE TRIGGER client_updated_at
  BEFORE UPDATE ON client
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- PROPERTY (rental units)
CREATE TABLE property (
  id                   uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id            uuid          NOT NULL REFERENCES client(id) ON DELETE RESTRICT,
  name                 text          NOT NULL,
  address              text          NOT NULL,
  bedrooms             smallint      NOT NULL DEFAULT 1,
  bathrooms            numeric(3,1)  NOT NULL DEFAULT 1.0,
  risk_level           risk_level    NOT NULL DEFAULT 'low',
  risk_reason          text          NOT NULL DEFAULT '',
  compliance_progress  smallint      NOT NULL DEFAULT 0
                                     CONSTRAINT compliance_progress_range CHECK (compliance_progress BETWEEN 0 AND 100),
  safety_score         smallint      NOT NULL DEFAULT 0
                                     CONSTRAINT safety_score_range CHECK (safety_score BETWEEN 0 AND 100),
  listing_active       boolean       NOT NULL DEFAULT false,
  pricelabs_synced     boolean       NOT NULL DEFAULT false,
  listing_description  text          NOT NULL DEFAULT '',
  listing_photo_count  smallint      NOT NULL DEFAULT 0,
  occupied_temp        smallint      NOT NULL DEFAULT 70,
  empty_temp           smallint      NOT NULL DEFAULT 65,
  avg_temp_adj         smallint      NOT NULL DEFAULT 0,
  sms_enabled          boolean       NOT NULL DEFAULT false,
  alarm_battery_level  smallint      NOT NULL DEFAULT 100,
  alarm_last_tested    date,
  lock_status          lock_status   NOT NULL DEFAULT 'online',
  leak_status          leak_status   NOT NULL DEFAULT 'clear',
  main_valve           valve_status  NOT NULL DEFAULT 'open',
  monthly_savings      numeric(10,2),
  created_at           timestamptz   NOT NULL DEFAULT now(),
  updated_at           timestamptz   NOT NULL DEFAULT now(),
  archived_at          timestamptz
);

CREATE INDEX idx_property_client_id ON property(client_id);

CREATE TRIGGER property_updated_at
  BEFORE UPDATE ON property
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- GUEST (first-class entity with cross-booking history)
CREATE TABLE guest (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  email       text,
  phone       text,
  notes       text        NOT NULL DEFAULT '',
  is_flagged  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TRIGGER guest_updated_at
  BEFORE UPDATE ON guest
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- BOOKING (reservations from Hospitable, direct, Airbnb, VRBO)
CREATE TABLE booking (
  id           uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid           NOT NULL REFERENCES property(id) ON DELETE RESTRICT,
  guest_id     uuid           NOT NULL REFERENCES guest(id)    ON DELETE RESTRICT,
  check_in     timestamptz    NOT NULL,
  check_out    timestamptz    NOT NULL,
  status       booking_status NOT NULL DEFAULT 'confirmed',
  source       booking_source NOT NULL DEFAULT 'direct',
  external_id  text,
  guest_count  smallint       NOT NULL DEFAULT 1,
  total_price  numeric(10,2),
  notes        text           NOT NULL DEFAULT '',
  created_at   timestamptz    NOT NULL DEFAULT now(),
  updated_at   timestamptz    NOT NULL DEFAULT now(),
  archived_at  timestamptz,
  CONSTRAINT booking_dates_valid CHECK (check_out > check_in)
);

CREATE INDEX idx_booking_property_id  ON booking(property_id);
CREATE INDEX idx_booking_guest_id     ON booking(guest_id);
CREATE INDEX idx_booking_check_in     ON booking(check_in);
CREATE INDEX idx_booking_external_id  ON booking(external_id) WHERE external_id IS NOT NULL;

CREATE TRIGGER booking_updated_at
  BEFORE UPDATE ON booking
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ACCESS_CODE (lock codes for guests + operational staff)
CREATE TABLE access_code (
  id           uuid               PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid               NOT NULL REFERENCES property(id) ON DELETE CASCADE,
  booking_id   uuid               REFERENCES booking(id) ON DELETE SET NULL,
  code         varchar(20)        NOT NULL,
  guest_name   text               NOT NULL,
  type         access_code_type   NOT NULL DEFAULT 'guest',
  status       access_code_status NOT NULL DEFAULT 'active',
  valid_from   timestamptz        NOT NULL,
  valid_until  timestamptz        NOT NULL,
  created_at   timestamptz        NOT NULL DEFAULT now(),
  updated_at   timestamptz        NOT NULL DEFAULT now(),
  archived_at  timestamptz
);

CREATE INDEX idx_access_code_property_id ON access_code(property_id);
CREATE INDEX idx_access_code_booking_id  ON access_code(booking_id) WHERE booking_id IS NOT NULL;

CREATE TRIGGER access_code_updated_at
  BEFORE UPDATE ON access_code
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- FINANCIAL_PERIOD (monthly snapshots per property — immutable audit data)
CREATE TABLE financial_period (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id       uuid          NOT NULL REFERENCES property(id) ON DELETE CASCADE,
  period_year       smallint      NOT NULL,
  period_month      smallint      NOT NULL
                                  CONSTRAINT period_month_range CHECK (period_month BETWEEN 1 AND 12),
  gross_rent        numeric(10,2) NOT NULL DEFAULT 0,
  tax_liability     numeric(10,2) NOT NULL DEFAULT 0,
  tax_readiness     smallint      NOT NULL DEFAULT 0
                                  CONSTRAINT tax_readiness_range CHECK (tax_readiness BETWEEN 0 AND 100),
  monthly_roi       numeric(5,2),
  remittance_days   smallint,
  remittance_period text,
  created_at        timestamptz   NOT NULL DEFAULT now(),
  updated_at        timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT financial_period_unique UNIQUE (property_id, period_year, period_month)
);

CREATE TRIGGER financial_period_updated_at
  BEFORE UPDATE ON financial_period
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ACTIVITY_LOG (append-only event log — no updated_at, no archived_at)
CREATE TABLE activity_log (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid          NOT NULL REFERENCES property(id)  ON DELETE CASCADE,
  booking_id   uuid          REFERENCES booking(id)            ON DELETE SET NULL,
  user_id      uuid          REFERENCES auth.users(id)         ON DELETE SET NULL,
  type         activity_type NOT NULL,
  message      text          NOT NULL,
  occurred_at  timestamptz   NOT NULL DEFAULT now(),
  created_at   timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_log_property_id  ON activity_log(property_id);
CREATE INDEX idx_activity_log_occurred_at  ON activity_log(occurred_at DESC);

-- MARKET_EVENT (global local events — games, festivals, conventions)
CREATE TABLE market_event (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  date_start  date        NOT NULL,
  date_end    date,
  description text        NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE INDEX idx_market_event_date_start ON market_event(date_start);

CREATE TRIGGER market_event_updated_at
  BEFORE UPDATE ON market_event
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- PROPERTY_EVENT (junction: market_event <-> property with per-property overrides)
CREATE TABLE property_event (
  id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     uuid    NOT NULL REFERENCES property(id)      ON DELETE CASCADE,
  event_id        uuid    NOT NULL REFERENCES market_event(id)   ON DELETE CASCADE,
  manual_override boolean NOT NULL DEFAULT false,
  pricing_notes   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT property_event_unique UNIQUE (property_id, event_id)
);

CREATE INDEX idx_property_event_property_id ON property_event(property_id);
CREATE INDEX idx_property_event_event_id    ON property_event(event_id);

CREATE TRIGGER property_event_updated_at
  BEFORE UPDATE ON property_event
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- SENSOR_SNAPSHOT (periodic IoT readings — immutable append-only)
CREATE TABLE sensor_snapshot (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid        NOT NULL REFERENCES property(id) ON DELETE CASCADE,
  sensor_type  sensor_type NOT NULL,
  value        numeric     NOT NULL,
  recorded_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sensor_snapshot_property_type ON sensor_snapshot(property_id, sensor_type);
CREATE INDEX idx_sensor_snapshot_recorded_at   ON sensor_snapshot USING brin(recorded_at);

-- SENSOR_ALERT (threshold breach alerts)
CREATE TABLE sensor_alert (
  id              uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     uuid           NOT NULL REFERENCES property(id) ON DELETE CASCADE,
  booking_id      uuid           REFERENCES booking(id)           ON DELETE SET NULL,
  sensor_type     sensor_type    NOT NULL,
  severity        alert_severity NOT NULL,
  threshold_value numeric        NOT NULL,
  actual_value    numeric        NOT NULL,
  message         text           NOT NULL,
  triggered_at    timestamptz    NOT NULL DEFAULT now(),
  resolved_at     timestamptz,
  created_at      timestamptz    NOT NULL DEFAULT now()
);

CREATE INDEX idx_sensor_alert_property_id ON sensor_alert(property_id);
CREATE INDEX idx_sensor_alert_unresolved  ON sensor_alert(property_id) WHERE resolved_at IS NULL;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Single company: all authenticated managers get full access
-- ============================================================================

ALTER TABLE client           ENABLE ROW LEVEL SECURITY;
ALTER TABLE property         ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest            ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking          ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_code      ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_period ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log     ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_event     ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_event   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_snapshot  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_alert     ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_all_client           ON client           FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_property         ON property         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_guest            ON guest            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_booking          ON booking          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_access_code      ON access_code      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_financial_period ON financial_period  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_activity_log     ON activity_log     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_market_event     ON market_event     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_property_event   ON property_event   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_sensor_snapshot  ON sensor_snapshot   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY allow_all_sensor_alert     ON sensor_alert     FOR ALL TO authenticated USING (true) WITH CHECK (true);
