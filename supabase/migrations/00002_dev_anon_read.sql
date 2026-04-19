-- ============================================================================
-- DEV ONLY — drop before production.
-- Grants anon SELECT on the tables the dashboard reads so the app can render
-- without a login flow during Phase 1 of the mock-data → Supabase cutover.
-- Existing authenticated policies from 00001_initial_schema.sql are untouched.
-- ============================================================================

CREATE POLICY allow_anon_select_client           ON client           FOR SELECT TO anon USING (true);
CREATE POLICY allow_anon_select_property         ON property         FOR SELECT TO anon USING (true);
CREATE POLICY allow_anon_select_financial_period ON financial_period FOR SELECT TO anon USING (true);
CREATE POLICY allow_anon_select_activity_log     ON activity_log     FOR SELECT TO anon USING (true);
CREATE POLICY allow_anon_select_sensor_snapshot  ON sensor_snapshot  FOR SELECT TO anon USING (true);
CREATE POLICY allow_anon_select_access_code      ON access_code      FOR SELECT TO anon USING (true);
CREATE POLICY allow_anon_select_property_event   ON property_event   FOR SELECT TO anon USING (true);
CREATE POLICY allow_anon_select_market_event     ON market_event     FOR SELECT TO anon USING (true);
