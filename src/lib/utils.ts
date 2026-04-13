import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RiskLevel = "low" | "medium" | "high" | "critical";

const RISK_BADGE_CLASSES: Record<RiskLevel, { pill: string; dot: string }> = {
  critical: { pill: "bg-red-500/10 text-red-400 border-red-500/30", dot: "bg-red-400" },
  high: { pill: "bg-amber-500/10 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  medium: { pill: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400" },
  low: { pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
};

export function getRiskBadgeClasses(level: RiskLevel) {
  return RISK_BADGE_CLASSES[level];
}

type ClientStatus = "active" | "pending" | "inactive";

const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
  active: "text-emerald-400",
  pending: "text-amber-400",
  inactive: "text-zinc-500",
};

export function getClientStatusColor(status: ClientStatus) {
  return CLIENT_STATUS_COLORS[status];
}
