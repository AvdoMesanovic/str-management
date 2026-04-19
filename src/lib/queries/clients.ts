import type { Database } from "@/types/database";
import type { Client } from "@/data/mockClients";
import type { SupabaseDB } from "@/lib/supabase/client";

type ClientRow = Database["public"]["Tables"]["client"]["Row"];

interface ClientWithJoins extends ClientRow {
  property: { id: string }[];
}

export async function getClients(supabase: SupabaseDB): Promise<Client[]> {
  const { data, error } = await supabase
    .from("client")
    .select("*, property ( id )")
    .is("archived_at", null)
    .order("name", { ascending: true })
    .returns<ClientWithJoins[]>();

  if (error) throw error;
  if (!data) return [];

  const propertyIds = data.flatMap((row) => row.property.map((p) => p.id));

  const revenueByClient = new Map<string, number>();

  if (propertyIds.length > 0) {
    const { data: periods, error: periodError } = await supabase
      .from("financial_period")
      .select("property_id, gross_rent")
      .in("property_id", propertyIds)
      .returns<{ property_id: string; gross_rent: number }[]>();

    if (periodError) throw periodError;

    const propertyToClient = new Map<string, string>();
    for (const row of data) {
      for (const p of row.property) {
        propertyToClient.set(p.id, row.id);
      }
    }

    for (const period of periods ?? []) {
      const clientId = propertyToClient.get(period.property_id);
      if (clientId) {
        revenueByClient.set(
          clientId,
          (revenueByClient.get(clientId) ?? 0) + Number(period.gross_rent),
        );
      }
    }
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    properties: row.property.map((p) => p.id),
    joinDate: row.join_date,
    status: row.status,
    totalRevenue: revenueByClient.get(row.id) ?? 0,
    preferredContact: row.preferred_contact,
    notes: row.notes,
  }));
}

export interface InsertClientData {
  name: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "text";
  notes: string;
}

export async function insertClient(
  supabase: SupabaseDB,
  data: InsertClientData,
): Promise<void> {
  const insertPayload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    preferred_contact: data.preferredContact,
    notes: data.notes,
  } satisfies Database["public"]["Tables"]["client"]["Insert"] as never;

  const { error } = await supabase
    .from("client")
    .insert(insertPayload);

  if (error) throw error;
}

export type UpdateClientData = InsertClientData;

export async function updateClient(
  supabase: SupabaseDB,
  clientId: string,
  data: UpdateClientData,
): Promise<void> {
  const updatePayload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    preferred_contact: data.preferredContact,
    notes: data.notes,
  } satisfies Database["public"]["Tables"]["client"]["Update"] as never;

  const { error } = await supabase
    .from("client")
    .update(updatePayload)
    .eq("id", clientId);

  if (error) throw error;
}

export async function deleteClient(
  supabase: SupabaseDB,
  clientId: string,
): Promise<void> {
  const updatePayload = {
    archived_at: new Date().toISOString(),
  } satisfies Database["public"]["Tables"]["client"]["Update"] as never;

  const { error } = await supabase
    .from("client")
    .update(updatePayload)
    .eq("id", clientId);

  if (error) throw error;
}
