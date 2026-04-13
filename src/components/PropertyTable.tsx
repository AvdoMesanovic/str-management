"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { ClientView } from "@/components/ClientView";
import type { PropertyEditData } from "@/components/PropertyEditDialog";
import { PropertyRow } from "@/components/PropertyRow";
import type { Property } from "@/data/mockData";

interface PropertyTableProps {
  properties: Property[];
  clientMode: boolean;
  onSelectProperty?: (property: Property) => void;
}

type SortField = "name" | "risk" | "compliance" | "roi";
type SortDirection = "asc" | "desc";

interface SortButtonProps {
  field: SortField;
  label: string;
  currentField: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
}

function SortButton({ field, label, currentField, currentDirection, onSort }: SortButtonProps) {
  const active = currentField === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-all ${
        active
          ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
      }`}
    >
      <span>{label}</span>
      {active ? (
        currentDirection === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

export function PropertyTable({ properties, clientMode, onSelectProperty }: PropertyTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  if (clientMode) {
    return <ClientView properties={properties} />;
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // TODO: wire up real edit/delete handlers when backend is ready
  const handleEdit = (_propertyId: string, _data: PropertyEditData) => {};
  const handleDelete = (_propertyId: string) => {};

  const sortedProperties = [...properties].sort((a, b) => {
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
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectProperty={onSelectProperty}
          />
        ))}
      </div>
    </div>
  );
}
