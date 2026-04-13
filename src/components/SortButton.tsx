"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type SortDirection = "asc" | "desc";

interface SortButtonProps<T extends string> {
  field: T;
  label: string;
  currentField: T;
  currentDirection: SortDirection;
  onSort: (field: T) => void;
}

export function SortButton<T extends string>({
  field,
  label,
  currentField,
  currentDirection,
  onSort,
}: SortButtonProps<T>) {
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
