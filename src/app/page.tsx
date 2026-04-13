"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { PropertyDetailView } from "@/components/PropertyDetailView";
import { PropertyTable } from "@/components/PropertyTable";
import { mockProperties, type Property } from "@/data/mockData";

export default function HomePage() {
  const [clientMode, setClientMode] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filtered = useMemo(() => {
    const q = propertySearch.trim().toLowerCase();
    if (!q) return mockProperties;
    return mockProperties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q),
    );
  }, [propertySearch]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Header
        clientMode={clientMode}
        onClientModeChange={(v) => {
          setClientMode(v);
          setSelectedProperty(null);
        }}
        onPropertySearch={setPropertySearch}
      />

      {selectedProperty && !clientMode ? (
        <PropertyDetailView
          property={selectedProperty}
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
            onSelectProperty={setSelectedProperty}
          />
        </>
      )}
    </div>
  );
}
