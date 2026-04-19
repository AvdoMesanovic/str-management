"use client";

import { useMemo, useState } from "react";
import { ClientView } from "@/components/ClientView";
import type { PropertyEditData } from "@/components/PropertyEditDialog";
import { PropertyRow } from "@/components/PropertyRow";
import { SortButton } from "@/components/SortButton";
import type { Client } from "@/data/mockClients";
import type { Property } from "@/data/mockData";

interface PropertyTableProps {
  properties: Property[];
  clientMode: boolean;
  clients: Client[];
  onSelectProperty?: (property: Property) => void;
  onEdit?: (propertyId: string, data: PropertyEditData) => void;
  onDelete?: (propertyId: string) => void;
}

type SortField = "name" | "risk" | "compliance" | "roi";
type SortDirection = "asc" | "desc";

export function PropertyTable({ properties, clientMode, clients, onSelectProperty, onEdit, onDelete }: PropertyTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "risk": {
          const riskValues = { low: 1, medium: 2, high: 3, critical: 4 };
          comparison = riskValues[a.riskLevel] - riskValues[b.riskLevel];
          break;
        }
        case "compliance":
          comparison = a.complianceProgress - b.complianceProgress;
          break;
        case "roi":
          comparison = a.monthlyROI - b.monthlyROI;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [properties, sortField, sortDirection]);

  if (clientMode) {
    return <ClientView properties={properties} clients={clients} />;
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-2 px-6 py-3">
          <SortButton field="name" label="Property" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          <SortButton field="risk" label="Health / Risk" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          <SortButton field="compliance" label="Compliance" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          <SortButton field="roi" label="ROI" currentField={sortField} currentDirection={sortDirection} onSort={handleSort} />

          <div className="ml-auto shrink-0 text-xs text-zinc-500">
            {sortedProperties.length} {sortedProperties.length === 1 ? "property" : "properties"}
          </div>
        </div>
      </div>

      <div>
        {sortedProperties.map((property) => (
          <PropertyRow
            key={property.id}
            property={property}
            clientMode={false}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelectProperty={onSelectProperty}
          />
        ))}
      </div>
    </div>
  );
}
