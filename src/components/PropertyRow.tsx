"use client";

import {
  Bell,
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  FileText,
  MessageSquare,
  Trash2,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import { ActivityLog } from "@/components/ActivityLog";
import { HealthSparkline } from "@/components/HealthSparkline";
import {
  PropertyEditDialog,
  type PropertyEditData,
} from "@/components/PropertyEditDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Progress } from "@/components/ui/progress";
import type { Property } from "@/data/mockData";

interface PropertyRowProps {
  property: Property;
  clientMode: boolean;
  onEdit?: (propertyId: string, data: PropertyEditData) => void;
  onDelete?: (propertyId: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export function PropertyRow({
  property,
  clientMode,
  onEdit,
  onDelete,
  onSelectProperty,
}: PropertyRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const getRiskColor = (level: Property["riskLevel"]) => {
    switch (level) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  const getComplianceColor = (progress: number) => {
    if (progress >= 90) return "bg-emerald-500";
    if (progress >= 70) return "bg-yellow-500";
    return "bg-amber-500";
  };

  const handleEdit = (data: PropertyEditData) => {
    onEdit?.(property.id, data);
  };

  const handleDelete = () => {
    if (
      onDelete &&
      confirm(
        `Are you sure you want to delete "${property.name}"? This action cannot be undone.`,
      )
    ) {
      onDelete(property.id);
    }
  };

  const handleView = () => {
    onSelectProperty?.(property);
  };

  const rowContent = (
    <div
      className="cursor-pointer select-none border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/30"
      onDoubleClick={!clientMode ? handleView : undefined}
      title={
        !clientMode ? "Double-click to open property detail view" : undefined
      }
    >
      <div className="grid grid-cols-1 gap-4 px-6 py-4 lg:grid-cols-[2fr_2fr_1.5fr_1fr_auto] lg:items-center">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm text-white">{property.name}</h3>
              <p className="text-xs text-zinc-500">{property.address}</p>
              {!clientMode && (
                <p className="mt-0.5 select-none text-[10px] text-zinc-700">
                  • double-click to open detail view
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 text-zinc-500 transition-colors hover:text-cyan-400 lg:hidden"
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {!clientMode && (
            <Badge
              className={`border text-xs ${getRiskColor(property.riskLevel)}`}
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              {property.riskLevel.toUpperCase()}: {property.riskReason}
            </Badge>
          )}

          {clientMode && (
            <div className="mt-2 space-y-1 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2">
              <div className="text-xs text-zinc-400">Monthly ROI</div>
              <div className="text-lg text-emerald-400">
                +{property.monthlyROI}%
              </div>
              <div className="text-xs text-zinc-400">
                Safety Score:{" "}
                <span className="text-emerald-400">
                  {property.safetyScore}/100
                </span>
              </div>
            </div>
          )}
        </div>

        {!clientMode && (
          <div className="grid grid-cols-2 gap-4">
            <HealthSparkline
              data={property.noiseData}
              color="#06b6d4"
              label="Noise"
              unit="dB"
            />
            <HealthSparkline
              data={property.tempData}
              color="#f59e0b"
              label="Temp"
              unit="°F"
            />
          </div>
        )}

        {!clientMode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Shadow Audit</span>
              <span className="text-zinc-300">
                {property.complianceProgress}%
              </span>
            </div>
            <div className="relative">
              <Progress value={property.complianceProgress} className="h-2" />
              <div
                className={`absolute inset-0 h-2 rounded-full ${getComplianceColor(property.complianceProgress)}`}
                style={{ width: `${property.complianceProgress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">STL 3% Tax Readiness</p>
          </div>
        )}

        {clientMode && (
          <div className="hidden space-y-1 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3 lg:block">
            <div className="text-xs text-zinc-400">Monthly ROI</div>
            <div className="text-xl text-emerald-400">
              +{property.monthlyROI}%
            </div>
            <div className="text-xs text-zinc-400">
              Safety:{" "}
              <span className="text-emerald-400">
                {property.safetyScore}/100
              </span>
            </div>
          </div>
        )}

        {!clientMode && (
          <div
            className="flex flex-wrap gap-2 lg:justify-end"
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="outline"
              className="border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10"
              title="Remote Unlock"
            >
              <Unlock className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10"
              title="Siren/Alarm (Safe)"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10"
              title="AI Message Guest"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setExpanded(!expanded)}
              title="Open Change Log"
            >
              <FileText className="h-4 w-4" />
              <span className="ml-1 hidden lg:inline">Log</span>
            </Button>
          </div>
        )}

        <div
          className="hidden lg:flex lg:justify-end"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-zinc-500 transition-colors hover:text-cyan-400"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {expanded && !clientMode && (
        <ActivityLog entries={property.activityLog} />
      )}
    </div>
  );

  return (
    <>
      {!clientMode ? (
        <ContextMenu>
          <ContextMenuTrigger asChild>{rowContent}</ContextMenuTrigger>
          <ContextMenuContent className="border-zinc-800 bg-zinc-900 text-white">
            <ContextMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={handleDelete}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        rowContent
      )}

      {!clientMode && (
        <PropertyEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          property={property}
          onSubmit={handleEdit}
        />
      )}
    </>
  );
}
