"use client";

import { Search, Users, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { ClientPropertyDrawer } from "@/components/ClientPropertyDrawer";
import { SortButton } from "@/components/SortButton";
import { Input } from "@/components/ui/input";
import { type Client, mockClients } from "@/data/mockClients";
import type { Property } from "@/data/mockData";
import { getClientStatusColor } from "@/lib/utils";

interface ClientViewProps {
  properties: Property[];
}

type SortField = "client" | "property" | "roi" | "safety";
type SortDirection = "asc" | "desc";

function getSafetyColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-amber-400";
  return "text-red-400";
}

function getSafetyBorderColor(score: number) {
  if (score >= 90) return "border-emerald-500/20 bg-emerald-950/20";
  if (score >= 75) return "border-amber-500/20 bg-amber-950/20";
  return "border-red-500/20 bg-red-950/20";
}

interface ClientPropertyCardProps {
  property: Property;
  onDoubleClick: () => void;
}

function ClientPropertyCard({ property, onDoubleClick }: ClientPropertyCardProps) {
  return (
    <div
      className="group flex cursor-pointer select-none flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
      onDoubleClick={onDoubleClick}
      title="Double-click to view details"
    >
      <div>
        <h4 className="text-sm text-white">{property.name}</h4>
        <p className="mt-0.5 text-xs text-zinc-500">{property.address}</p>
        <p className="mt-1 text-[9px] text-zinc-700 transition-colors group-hover:text-zinc-600">
          Double-click for property details
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col justify-between rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3">
          <span className="text-xs text-zinc-400">Monthly ROI</span>
          <span className="mt-1 text-xl text-emerald-400">+{property.monthlyROI}%</span>
        </div>

        <div className={`flex flex-col justify-between rounded-lg border p-3 ${getSafetyBorderColor(property.safetyScore)}`}>
          <span className="text-xs text-zinc-400">Safety Score</span>
          <span className={`mt-1 text-xl ${getSafetyColor(property.safetyScore)}`}>
            {property.safetyScore}
            <span className="text-sm text-zinc-500">/100</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function ClientView({ properties }: ClientViewProps) {
  const [clientSearch, setClientSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("client");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const propertyClientMap = useMemo(() => {
    const map: Record<string, Client> = {};
    mockClients.forEach((client) => {
      client.properties.forEach((propId) => {
        map[propId] = client;
      });
    });
    return map;
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filtered = useMemo(() => {
    if (!clientSearch.trim()) return properties;
    const q = clientSearch.toLowerCase();
    return properties.filter((p) => {
      const client = propertyClientMap[p.id];
      return client?.name.toLowerCase().includes(q);
    });
  }, [properties, clientSearch, propertyClientMap]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "client": {
          const ca = propertyClientMap[a.id]?.name ?? "";
          const cb = propertyClientMap[b.id]?.name ?? "";
          cmp = ca.localeCompare(cb);
          break;
        }
        case "property":
          cmp = a.name.localeCompare(b.name);
          break;
        case "roi":
          cmp = a.monthlyROI - b.monthlyROI;
          break;
        case "safety":
          cmp = a.safetyScore - b.safetyScore;
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection, propertyClientMap]);

  const { groupOrder, groups } = useMemo(() => {
    const order: string[] = [];
    const map: Record<string, { client: Client | null; props: Property[] }> = {};
    sorted.forEach((p) => {
      const client = propertyClientMap[p.id] ?? null;
      const key = client?.id ?? "unknown";
      if (!map[key]) {
        map[key] = { client, props: [] };
        order.push(key);
      }
      map[key].props.push(p);
    });
    return { groupOrder: order, groups: map };
  }, [sorted, propertyClientMap]);

  const totalShown = sorted.length;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 px-6 py-3 backdrop-blur-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="Filter by client..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="border-zinc-700 bg-zinc-800 pl-9 pr-9 text-white placeholder:text-zinc-500"
            />
            {clientSearch && (
              <button
                type="button"
                onClick={() => setClientSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <SortButton field="client" label="Client" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />
            <SortButton field="property" label="Property" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />
            <SortButton field="roi" label="ROI" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />
            <SortButton field="safety" label="Safety" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          </div>

          <div className="ml-auto shrink-0 text-xs text-zinc-500">
            {totalShown} {totalShown === 1 ? "property" : "properties"}
            {clientSearch && <span className="text-cyan-400"> · filtered</span>}
          </div>
        </div>
      </div>

      {groupOrder.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-zinc-500">
          <Users className="h-10 w-10 opacity-30" />
          <p className="text-sm">No properties match your client search.</p>
          <button
            type="button"
            onClick={() => setClientSearch("")}
            className="text-xs text-cyan-400 hover:underline"
          >
            Clear filter
          </button>
        </div>
      ) : (
        groupOrder.map((clientId) => {
          const group = groups[clientId];
          if (!group) return null;
          const client = group.client;

          return (
            <div key={clientId} className="border-b border-zinc-800/50 last:border-b-0">
              <div className="flex items-center gap-3 border-b border-zinc-800/40 bg-zinc-900/40 px-6 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-sm text-cyan-400">
                  {client?.name.charAt(0) ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-white">{client?.name ?? "Unknown Client"}</span>
                  {client && <span className="ml-2 text-xs text-zinc-500">{client.email}</span>}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {client && (
                    <span
                      className={`text-xs ${getClientStatusColor(client.status)}`}
                    >
                      {client.status}
                    </span>
                  )}
                  <span className="text-xs text-zinc-600">
                    {group.props.length} {group.props.length === 1 ? "property" : "properties"}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
                {group.props.map((property) => (
                  <ClientPropertyCard
                    key={property.id}
                    property={property}
                    onDoubleClick={() => setSelectedProperty(property)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}

      <AnimatePresence>
        {selectedProperty && (
          <ClientPropertyDrawer
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
