import type { Database } from "@/types/database";
import type {
  AccessCode,
  ActivityLogEntry,
  Property,
  PropertyOwner,
  UpcomingEvent,
} from "@/data/mockData";
import type { SupabaseDB } from "@/lib/supabase/client";

type PropertyRow = Database["public"]["Tables"]["property"]["Row"];
type ClientRow = Database["public"]["Tables"]["client"]["Row"];
type FinancialPeriodRow = Database["public"]["Tables"]["financial_period"]["Row"];
type ActivityLogRow = Database["public"]["Tables"]["activity_log"]["Row"];

type AccessCodeRow = Database["public"]["Tables"]["access_code"]["Row"];
type SensorSnapshotRow = Database["public"]["Tables"]["sensor_snapshot"]["Row"];
type MarketEventRow = Database["public"]["Tables"]["market_event"]["Row"];

interface PropertyWithJoins extends PropertyRow {
  client: Pick<ClientRow, "name" | "phone" | "email" | "notes"> | null;
  financial_period: Pick<
    FinancialPeriodRow,
    | "gross_rent"
    | "tax_liability"
    | "tax_readiness"
    | "monthly_roi"
    | "remittance_days"
    | "remittance_period"
    | "period_year"
    | "period_month"
    | "updated_at"
  >[];
}

interface PropertyEventWithJoin {
  manual_override: boolean;
  updated_at: string;
  market_event: Pick<MarketEventRow, "name" | "date_start" | "date_end">;
}

export interface PropertyDetail {
  accessCodes: AccessCode[];
  heartbeatData: number[];
  decibelData12h: number[];
  historicalUtils: number[];
  currentUtils: number[];
  events: UpcomingEvent[];
  lastUpdate: string;
}

export async function getPropertyList(supabase: SupabaseDB): Promise<Property[]> {
  const { data: rows, error } = await supabase
    .from("property")
    .select(
      `*,
       client:client_id ( name, phone, email, notes ),
       financial_period ( gross_rent, tax_liability, tax_readiness, monthly_roi, remittance_days, remittance_period, period_year, period_month, updated_at )`,
    )
    .is("archived_at", null)
    .order("name", { ascending: true })
    .returns<PropertyWithJoins[]>();

  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  const propertyIds = rows.map((r) => r.id);

  const [logsResult, sensorsResult] = await Promise.all([
    supabase
      .from("activity_log")
      .select("*")
      .in("property_id", propertyIds)
      .order("occurred_at", { ascending: false })
      .limit(30)
      .returns<ActivityLogRow[]>(),
    supabase
      .from("sensor_snapshot")
      .select("property_id, sensor_type, value, recorded_at")
      .in("property_id", propertyIds)
      .in("sensor_type", ["noise_db", "temperature"])
      .order("recorded_at", { ascending: true })
      .returns<Pick<SensorSnapshotRow, "property_id" | "sensor_type" | "value" | "recorded_at">[]>(),
  ]);

  if (logsResult.error) throw logsResult.error;
  if (sensorsResult.error) throw sensorsResult.error;

  const logsByProperty = new Map<string, ActivityLogRow[]>();
  for (const log of logsResult.data ?? []) {
    const list = logsByProperty.get(log.property_id) ?? [];
    list.push(log);
    logsByProperty.set(log.property_id, list);
  }

  const noiseByProperty = new Map<string, number[]>();
  const tempByProperty = new Map<string, number[]>();
  for (const snap of sensorsResult.data ?? []) {
    const target = snap.sensor_type === "noise_db" ? noiseByProperty : tempByProperty;
    const list = target.get(snap.property_id) ?? [];
    list.push(Number(snap.value));
    target.set(snap.property_id, list);
  }

  return rows.map((row) =>
    mapPropertyRow(
      row,
      logsByProperty.get(row.id) ?? [],
      noiseByProperty.get(row.id) ?? [],
      tempByProperty.get(row.id) ?? [],
    ),
  );
}

function mapPropertyRow(
  row: PropertyWithJoins,
  logs: ActivityLogRow[],
  noiseData: number[],
  tempData: number[],
): Property {
  const latestPeriod = pickLatestPeriod(row.financial_period);

  const owner: PropertyOwner = {
    name: row.client?.name ?? "",
    phone: row.client?.phone ?? "",
    email: row.client?.email ?? "",
    notes: row.client?.notes ?? "",
  };

  const activityLog: ActivityLogEntry[] = logs
    .slice()
    .reverse()
    .map((log) => ({
      timestamp: new Date(log.occurred_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      type: log.type,
      message: log.message,
    }));

  const emptyAccessCodes: AccessCode[] = [];
  const emptyEvents: UpcomingEvent[] = [];

  return {
    id: row.id,
    name: row.name,
    address: row.address,
    riskLevel: row.risk_level,
    riskReason: row.risk_reason,
    noiseData,
    tempData,
    complianceProgress: row.compliance_progress,
    monthlyROI: Number(latestPeriod?.monthly_roi ?? 0),
    safetyScore: row.safety_score,
    activityLog,
    owner,
    financial: {
      grossRent: Number(latestPeriod?.gross_rent ?? 0),
      taxLiability: Number(latestPeriod?.tax_liability ?? 0),
      taxReadiness: latestPeriod?.tax_readiness ?? 0,
      lastSync: latestPeriod?.updated_at
        ? new Date(latestPeriod.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
      remittanceDays: latestPeriod?.remittance_days ?? 0,
      remittancePeriod: latestPeriod?.remittance_period ?? "",
    },
    security: {
      lockStatus: row.lock_status,
      accessCodes: emptyAccessCodes,
      heartbeatData: [],
    },
    safety: {
      decibelData12h: [],
      alarmBattery: row.alarm_battery_level,
      lastTested: row.alarm_last_tested ?? "—",
      smsEnabled: row.sms_enabled,
    },
    environmental: {
      leakStatus: row.leak_status,
      mainValve: row.main_valve,
      historicalUtils: [],
      currentUtils: [],
      monthlySavings: Number(row.monthly_savings ?? 0),
      avgTempAdj: row.avg_temp_adj,
      occupiedTemp: row.occupied_temp,
      emptyTemp: row.empty_temp,
    },
    revenue: {
      listingActive: row.listing_active,
      pricelabsSynced: row.pricelabs_synced,
      lastUpdate: "—",
      events: emptyEvents,
      description: row.listing_description,
      listingPhotos: row.listing_photo_count,
      gapOpportunities: [],
    },
  };
}

export async function getPropertyDetail(
  supabase: SupabaseDB,
  propertyId: string,
): Promise<PropertyDetail> {
  const [accessResult, eventsResult, sensorResult] = await Promise.all([
    supabase
      .from("access_code")
      .select("code, guest_name, valid_from, valid_until, status")
      .eq("property_id", propertyId)
      .is("archived_at", null)
      .neq("status", "revoked")
      .order("valid_from", { ascending: false })
      .returns<Pick<AccessCodeRow, "code" | "guest_name" | "valid_from" | "valid_until" | "status">[]>(),

    supabase
      .from("property_event")
      .select("manual_override, updated_at, market_event:event_id ( name, date_start, date_end )")
      .eq("property_id", propertyId)
      .returns<PropertyEventWithJoin[]>(),

    supabase
      .from("sensor_snapshot")
      .select("sensor_type, value, recorded_at")
      .eq("property_id", propertyId)
      .order("recorded_at", { ascending: true })
      .returns<Pick<SensorSnapshotRow, "sensor_type" | "value" | "recorded_at">[]>(),
  ]);

  if (accessResult.error) throw accessResult.error;
  if (eventsResult.error) throw eventsResult.error;
  if (sensorResult.error) throw sensorResult.error;

  const accessCodes: AccessCode[] = (accessResult.data ?? []).map((row) => ({
    guest: row.guest_name,
    code: row.code,
    checkin: formatAccessDate(row.valid_from),
    checkout: formatAccessDate(row.valid_until),
    status: row.status as "active" | "expired",
  }));

  const events: UpcomingEvent[] = (eventsResult.data ?? []).map((row) => ({
    name: row.market_event.name,
    date: formatDateRange(row.market_event.date_start, row.market_event.date_end),
    manualOverride: row.manual_override,
  }));

  const noiseVals: number[] = [];
  const heartbeatVals: number[] = [];
  const utilityVals: { value: number; recordedAt: string }[] = [];

  for (const snap of sensorResult.data ?? []) {
    switch (snap.sensor_type) {
      case "noise_db":
        noiseVals.push(Number(snap.value));
        break;
      case "lock_heartbeat":
        heartbeatVals.push(Number(snap.value));
        break;
      case "utility_usage":
        utilityVals.push({ value: Number(snap.value), recordedAt: snap.recorded_at });
        break;
    }
  }

  const decibelData12h = noiseVals.slice(-12);
  const heartbeatData = heartbeatVals.slice(-24);

  const sortedUtils = utilityVals.sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );
  const half = Math.ceil(sortedUtils.length / 2);
  const historicalUtils = sortedUtils.slice(0, half).map((u) => u.value);
  const currentUtils = sortedUtils.slice(half).map((u) => u.value);

  const latestEventUpdate = (eventsResult.data ?? []).reduce<string | null>(
    (latest, row) =>
      !latest || row.updated_at > latest ? row.updated_at : latest,
    null,
  );
  const lastUpdate = latestEventUpdate
    ? new Date(latestEventUpdate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return {
    accessCodes,
    heartbeatData,
    decibelData12h,
    historicalUtils,
    currentUtils,
    events,
    lastUpdate,
  };
}

function formatAccessDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateRange(start: string, end: string | null): string {
  const s = new Date(start);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (!end) return fmt(s);

  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${fmt(s)} – ${fmt(e)}`;
}

export interface InsertPropertyData {
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  clientId: string;
  notes: string;
}

export async function insertProperty(
  supabase: SupabaseDB,
  data: InsertPropertyData,
): Promise<void> {
  const insertPayload = {
    name: data.name,
    address: data.address,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    client_id: data.clientId,
    risk_reason: data.notes,
  } satisfies Database["public"]["Tables"]["property"]["Insert"] as never;

  const { error } = await supabase.from("property").insert(insertPayload);

  if (error) throw error;
}

export interface UpdatePropertyData {
  name: string;
  address: string;
  notes?: string;
}

export async function updateProperty(
  supabase: SupabaseDB,
  propertyId: string,
  data: UpdatePropertyData,
): Promise<void> {
  const updatePayload = {
    name: data.name,
    address: data.address,
    ...(data.notes !== undefined && { risk_reason: data.notes }),
  } satisfies Database["public"]["Tables"]["property"]["Update"] as never;

  const { error } = await supabase
    .from("property")
    .update(updatePayload)
    .eq("id", propertyId);

  if (error) throw error;
}

export async function deleteProperty(
  supabase: SupabaseDB,
  propertyId: string,
): Promise<void> {
  const updatePayload = {
    archived_at: new Date().toISOString(),
  } satisfies Database["public"]["Tables"]["property"]["Update"] as never;

  const { error } = await supabase
    .from("property")
    .update(updatePayload)
    .eq("id", propertyId);

  if (error) throw error;
}

function pickLatestPeriod(
  periods: PropertyWithJoins["financial_period"],
): PropertyWithJoins["financial_period"][number] | undefined {
  if (!periods || periods.length === 0) return undefined;
  return [...periods].sort((a, b) => {
    if (a.period_year !== b.period_year) return b.period_year - a.period_year;
    return b.period_month - a.period_month;
  })[0];
}
