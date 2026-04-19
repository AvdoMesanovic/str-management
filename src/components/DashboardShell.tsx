"use client";

import { useCallback, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { PropertyDetailView } from "@/components/PropertyDetailView";
import { PropertyTable } from "@/components/PropertyTable";
import type { Client } from "@/data/mockClients";
import type { Property } from "@/data/mockData";
import type { ClientIntakeData } from "@/components/ClientIntakeDialog";
import type { PropertyIntakeData } from "@/components/PropertyIntakeDialog";
import { usePropertyDetail } from "@/hooks/usePropertyDetail";
import { useSupabase } from "@/hooks/useSupabase";
import type { ClientEditData } from "@/components/ClientDialog";
import { getClients, insertClient, updateClient, deleteClient } from "@/lib/queries/clients";
import { getPropertyList, insertProperty, updateProperty, deleteProperty } from "@/lib/queries/properties";
import type { PropertyEditData } from "@/components/PropertyEditDialog";

interface DashboardShellProps {
  initialProperties: Property[];
  clients: Client[];
}

function PropertyDetailWrapper({
  baseProperty,
  onBack,
}: { baseProperty: Property; onBack: () => void }) {
  const { property } = usePropertyDetail(baseProperty);
  return <PropertyDetailView property={property} onBack={onBack} />;
}

export function DashboardShell({ initialProperties, clients: initialClients }: DashboardShellProps) {
  const supabase = useSupabase();
  const [properties, setProperties] = useState(initialProperties);
  const [clients, setClients] = useState(initialClients);
  const [clientMode, setClientMode] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const refreshData = useCallback(async () => {
    const [newProperties, newClients] = await Promise.all([
      getPropertyList(supabase),
      getClients(supabase),
    ]);
    setProperties(newProperties);
    setClients(newClients);
  }, [supabase]);

  const handlePropertyIntakeSubmit = useCallback(
    async (data: PropertyIntakeData) => {
      await insertProperty(supabase, data);
      await refreshData();
    },
    [supabase, refreshData],
  );

  const handleClientIntakeSubmit = useCallback(
    async (data: ClientIntakeData) => {
      await insertClient(supabase, data);
      await refreshData();
    },
    [supabase, refreshData],
  );

  const handlePropertyEdit = useCallback(
    async (propertyId: string, data: PropertyEditData) => {
      await updateProperty(supabase, propertyId, data);
      await refreshData();
    },
    [supabase, refreshData],
  );

  const handlePropertyDelete = useCallback(
    async (propertyId: string) => {
      await deleteProperty(supabase, propertyId);
      setSelectedProperty((current) =>
        current?.id === propertyId ? null : current,
      );
      await refreshData();
    },
    [supabase, refreshData],
  );

  const handleClientEdit = useCallback(
    async (clientId: string, data: ClientEditData) => {
      await updateClient(supabase, clientId, data);
      await refreshData();
    },
    [supabase, refreshData],
  );

  const handleClientDelete = useCallback(
    async (clientId: string) => {
      await deleteClient(supabase, clientId);
      await refreshData();
    },
    [supabase, refreshData],
  );

  const filtered = useMemo(() => {
    const q = propertySearch.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q),
    );
  }, [properties, propertySearch]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Header
        clientMode={clientMode}
        onClientModeChange={(v) => {
          setClientMode(v);
          setSelectedProperty(null);
        }}
        onPropertySearch={setPropertySearch}
        onLogoClick={() => setSelectedProperty(null)}
        clients={clients}
        onPropertyIntakeSubmit={handlePropertyIntakeSubmit}
        onClientIntakeSubmit={handleClientIntakeSubmit}
        onClientEdit={handleClientEdit}
        onClientDelete={handleClientDelete}
      />

      {selectedProperty && !clientMode ? (
        <PropertyDetailWrapper
          key={selectedProperty.id}
          baseProperty={selectedProperty}
          onBack={() => setSelectedProperty(null)}
        />
      ) : (
        <>
          {propertySearch && !clientMode && (
            <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-2 text-xs text-cyan-400">
              Showing {filtered.length}{" "}
              {filtered.length === 1 ? "property" : "properties"} matching
              &quot;{propertySearch}&quot;
            </div>
          )}
          <PropertyTable
            properties={filtered}
            clientMode={clientMode}
            clients={clients}
            onSelectProperty={setSelectedProperty}
            onEdit={handlePropertyEdit}
            onDelete={handlePropertyDelete}
          />
        </>
      )}
    </div>
  );
}
