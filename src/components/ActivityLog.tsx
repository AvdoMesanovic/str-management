"use client";

import { Terminal } from "lucide-react";
import type { ActivityLogEntry } from "@/data/mockData";

interface ActivityLogProps {
  entries: ActivityLogEntry[];
}

const typeConfig: Record<ActivityLogEntry["type"], { color: string; icon: string }> = {
  automated: { color: "text-cyan-400", icon: "⚙" },
  manual: { color: "text-amber-400", icon: "👤" },
  alert: { color: "text-red-400", icon: "⚠" },
};

export function ActivityLog({ entries }: ActivityLogProps) {

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/50">
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-cyan-400">
          <Terminal className="h-4 w-4" />
          <span>Management Activity Log</span>
        </div>

        <div className="space-y-2 rounded-lg border border-zinc-800/50 bg-black/30 p-4 font-mono text-xs">
          {entries.map((entry, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-zinc-600">{entry.timestamp}</span>
              <span className={typeConfig[entry.type].color}>
                {typeConfig[entry.type].icon}
              </span>
              <span className="flex-1 text-zinc-300">{entry.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
