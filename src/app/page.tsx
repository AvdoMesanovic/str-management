import { DashboardShell } from "@/components/DashboardShell";
import { getClients } from "@/lib/queries/clients";
import { getPropertyList } from "@/lib/queries/properties";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const [properties, clients] = await Promise.all([
    getPropertyList(supabase),
    getClients(supabase),
  ]);

  return <DashboardShell initialProperties={properties} clients={clients} />;
}
