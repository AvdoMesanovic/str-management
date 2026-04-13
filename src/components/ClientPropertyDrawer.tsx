"use client";

import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Droplets,
  Shield,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Property } from "@/data/mockData";

function extractZipTitle(name: string): { zip: string; title: string } {
  const m = name.match(/^(\d{5})\s+(.+)$/);
  return m ? { zip: m[1], title: m[2] } : { zip: "", title: name };
}

interface MiniAreaChartProps {
  data: number[];
  color?: string;
  gradId: string;
}

function MiniAreaChart({ data, color = "#10b981", gradId }: MiniAreaChartProps) {
  const W = 220;
  const H = 52;
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 6) - 3,
  }));

  const linePts = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = [
    `M ${pts[0].x.toFixed(1)} ${H}`,
    ...pts.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
    `L ${pts[pts.length - 1].x.toFixed(1)} ${H}`,
    "Z",
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={linePts}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={3} fill={color} />
    </svg>
  );
}

function GlowStars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          style={{
            filter: i < count ? "drop-shadow(0 0 5px rgba(6,182,212,0.9))" : undefined,
          }}
          fill={i < count ? "#06b6d4" : "#3f3f46"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

interface ArcGaugeProps {
  value: number;
  color: string;
  label: string;
}

function ArcGauge({ value, color, label }: ArcGaugeProps) {
  const r = 38;
  const cx = 56;
  const cy = 52;
  const halfCirc = Math.PI * r;
  const filled = Math.max(0, Math.min(1, value / 100)) * halfCirc;
  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  const isWarning = color === "#f97316";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full">
        <svg viewBox="0 0 112 62" className="w-full">
          <path d={bgPath} stroke="#27272a" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path
            d={bgPath}
            stroke={color}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${halfCirc}`}
            style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
          />
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill={color}
            fontSize="13"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            {value}%
          </text>
          {isWarning && (
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#f97316" fontSize="7">
              LOW BATTERY
            </text>
          )}
        </svg>
      </div>
      <div className="max-w-[88px] text-center text-[9px] leading-tight text-zinc-400">{label}</div>
    </div>
  );
}

interface TimelineEventProps {
  time: string;
  label: string;
  type: "trigger" | "response";
  responseTime?: string;
  isLast?: boolean;
}

function TimelineEvent({ time, label, type, responseTime, isLast }: TimelineEventProps) {
  const isTrigger = type === "trigger";
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
            isTrigger
              ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]"
              : "bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.7)]"
          }`}
        />
        {!isLast && <div className="my-1 w-px flex-1 bg-zinc-800" style={{ minHeight: 16 }} />}
      </div>
      <div className={`flex-1 pb-3 ${isLast ? "pb-0" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs ${isTrigger ? "text-red-400" : "text-cyan-400"}`}>{label}</span>
          {responseTime && (
            <span className="flex-shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] text-emerald-400">
              ⚡ {responseTime}
            </span>
          )}
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-zinc-600">{time}</div>
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  icon: React.ElementType;
  label: string;
}

function SectionHeader({ icon: Icon, label }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-cyan-400" />
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="h-px flex-1 bg-zinc-800/80" />
    </div>
  );
}

interface ClientPropertyDrawerProps {
  property: Property;
  onClose: () => void;
}

const MIN_WIDTH = 380;
const MAX_WIDTH_VW = 92;
const DEFAULT_WIDTH = 480;

export function ClientPropertyDrawer({ property, onClose }: ClientPropertyDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_WIDTH);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = drawerWidth;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [drawerWidth]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.clientX;
    const maxPx = window.innerWidth * (MAX_WIDTH_VW / 100);
    const next = Math.min(maxPx, Math.max(MIN_WIDTH, startWidth.current + delta));
    setDrawerWidth(next);
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const { zip, title } = extractZipTitle(property.name);

  const gross = property.financial.grossRent;
  const platformFees = Math.round(gross * 0.18);
  const cleaningFees = Math.round(gross * 0.1);
  const netProfit = gross - platformFees - cleaningFees;

  const profitTrend = [
    Math.round(netProfit * 0.5),
    Math.round(netProfit * 0.65),
    Math.round(netProfit * 0.58),
    Math.round(netProfit * 0.74),
    Math.round(netProfit * 0.82),
    Math.round(netProfit * 0.93),
    netProfit,
  ];

  const taxPct = property.financial.taxReadiness;
  const taxReady = taxPct >= 90;
  const taxColor = taxReady ? "#06b6d4" : taxPct >= 70 ? "#f59e0b" : "#ef4444";

  const schlageBattery = property.safety.alarmBattery;
  const schlageColor = schlageBattery >= 20 ? "#06b6d4" : "#f97316";
  const sc5Health = property.safetyScore;
  const sc5Color = sc5Health >= 80 ? "#10b981" : sc5Health >= 60 ? "#f59e0b" : "#ef4444";

  const isLeakClear = property.environmental.leakStatus === "clear";

  const baseHour = 9;
  const noiseEvents: Array<{
    time: string;
    label: string;
    type: "trigger" | "response";
    responseTime?: string;
  }> = [
    { time: `${baseHour}:12 PM`, label: "dB Threshold Trigger", type: "trigger" },
    {
      time: `${baseHour}:17 PM`,
      label: "Hospitable automated warning sent",
      type: "response",
      responseTime: "5 min",
    },
    { time: "10:45 PM", label: "dB Threshold Trigger", type: "trigger" },
    {
      time: "10:49 PM",
      label: "Hospitable automated warning sent",
      type: "response",
      responseTime: "4 min",
    },
  ];

  const gradId = `profit-grad-${property.id}`;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex">
      <motion.div
        className="flex-1 cursor-pointer bg-black/50 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      <motion.div
        className="relative flex flex-col overflow-hidden border-l border-zinc-800 bg-zinc-950 shadow-[-4px_0_40px_rgba(0,0,0,0.6)]"
        style={{ width: drawerWidth, maxWidth: `${MAX_WIDTH_VW}vw` }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280, mass: 0.9 }}
      >
        {/* Resize handle */}
        <div
          className="absolute inset-y-0 left-0 z-10 w-2 cursor-col-resize transition-colors hover:bg-cyan-500/20 active:bg-cyan-500/30"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        <div className="flex-shrink-0 border-b border-zinc-800 bg-zinc-900/90 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                {zip && (
                  <span className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                    {zip}
                  </span>
                )}
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400">Active</span>
                </div>
              </div>
              <h2 className="truncate text-base leading-snug text-white">{title}</h2>
              <p className="mt-0.5 text-xs text-zinc-500">{property.address}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/80 text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-700 hover:text-zinc-100"
              aria-label="Close drawer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-5">
            <div>
              <SectionHeader icon={TrendingUp} label="Performance Report · Wealth" />

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-zinc-500">
                    <DollarSign className="h-2.5 w-2.5" />
                    Net Profit MTD
                  </div>
                  <div className="text-lg leading-none text-emerald-400">
                    +${netProfit.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-zinc-600">after fees &amp; cleaning</div>

                  <div className="my-1 h-[48px] w-full">
                    <MiniAreaChart data={profitTrend} color="#10b981" gradId={gradId} />
                  </div>

                  <div className="space-y-1 border-t border-zinc-800/80 pt-2">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-zinc-600">Gross</span>
                      <span className="text-zinc-400">${gross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-zinc-600">Platform</span>
                      <span className="text-orange-400">−${platformFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-zinc-600">Cleaning</span>
                      <span className="text-orange-400">−${cleaningFees.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
                  <div className="mb-1 text-[9px] uppercase tracking-wide text-zinc-500">
                    Review Summary
                  </div>

                  <div className="my-2 text-4xl leading-none text-white">4.9</div>

                  <GlowStars count={5} />

                  <div className="mt-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-cyan-400">Excellent</span>
                  </div>

                  <div className="mt-3 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                    <div className="text-[9px] text-zinc-600">5-Star Streak</div>
                    <div className="text-base text-cyan-400">12</div>
                    <div className="text-[9px] text-zinc-600">bookings</div>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
                  <div className="mb-2 text-[9px] uppercase tracking-wide text-zinc-500">
                    Tax Readiness
                  </div>

                  <div
                    className="mb-2 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{
                      background: `${taxColor}18`,
                      boxShadow: `0 0 18px ${taxColor}40`,
                      border: `1px solid ${taxColor}35`,
                    }}
                  >
                    <CheckCircle
                      className="h-7 w-7"
                      style={{ color: taxColor, filter: `drop-shadow(0 0 6px ${taxColor}80)` }}
                    />
                  </div>

                  <div className="text-lg leading-none" style={{ color: taxColor }}>
                    {taxPct}%
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="text-[9px] text-zinc-500">STL 3% City Fee</div>
                    <div className="text-[10px]" style={{ color: taxColor }}>
                      {taxReady ? "Calculated & Ready" : "In Progress"}
                    </div>
                    <div className="text-[9px] text-zinc-600">{property.financial.remittancePeriod}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1">
                <Shield className="h-3 w-3 text-cyan-400" />
                <span className="text-[9px] uppercase tracking-widest text-cyan-400/80">
                  The Shield · Risk &amp; Prevention
                </span>
              </div>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs text-zinc-300">Noise Intervention Timeline</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-zinc-600">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      style={{ boxShadow: "0 0 4px rgba(52,211,153,0.8)" }}
                    />
                    Avg 4.5 min response
                  </div>
                </div>

                <div>
                  {noiseEvents.map((ev, i) => (
                    <TimelineEvent
                      key={i}
                      time={ev.time}
                      label={ev.label}
                      type={ev.type}
                      responseTime={ev.responseTime}
                      isLast={i === noiseEvents.length - 1}
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-4 border-t border-zinc-800/60 pt-3 text-[9px] text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    dB Threshold Trigger
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    Hospitable Auto-Response
                  </span>
                  <span className="ml-auto">2 interventions tonight</span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-zinc-300">Proactive Maintenance</span>
                </div>

                <div
                  className={`mb-4 flex items-center gap-4 rounded-xl border px-4 py-3 ${
                    isLeakClear
                      ? "border-emerald-500/25 bg-emerald-500/8"
                      : "border-red-500/30 bg-red-500/8"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        isLeakClear ? "bg-emerald-500/15" : "bg-red-500/15"
                      }`}
                      style={{
                        boxShadow: isLeakClear
                          ? "0 0 20px rgba(52,211,153,0.4), inset 0 0 12px rgba(52,211,153,0.15)"
                          : "0 0 20px rgba(239,68,68,0.4)",
                      }}
                    >
                      {isLeakClear ? (
                        <Droplets
                          className="h-5 w-5 text-emerald-400"
                          style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.8))" }}
                        />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    {isLeakClear && (
                      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                    )}
                  </div>

                  <div>
                    <div className="mb-0.5 text-[10px] text-zinc-500">Phyn Smart Water Status</div>
                    <div
                      className={`text-sm ${isLeakClear ? "text-emerald-400" : "text-red-400"}`}
                      style={{
                        filter: isLeakClear ? "drop-shadow(0 0 6px rgba(52,211,153,0.5))" : undefined,
                      }}
                    >
                      {isLeakClear ? "SECURE" : "ALERT — LEAK DETECTED"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-950/70 px-2 py-3 text-center">
                    <div className="mb-1 text-[9px] text-zinc-600">Pressure Logs</div>
                    <div className="text-[10px] text-cyan-400">Normal</div>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border border-emerald-500/15 bg-emerald-950/20 px-2 py-3 text-center">
                    <div className="mb-1 text-[9px] text-zinc-600">Leak Risk</div>
                    <div className="text-[10px] text-emerald-400">LOW · AI</div>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-950/70 px-2 py-3 text-center">
                    <div className="mb-1 text-[9px] text-zinc-600">Last Check</div>
                    <div className="text-[10px] text-zinc-400">2h ago</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-zinc-300">Safety Audit Gauges</span>
                  {schlageBattery < 20 && (
                    <span className="ml-auto flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[9px] text-orange-400">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Battery Low
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <ArcGauge value={schlageBattery} color={schlageColor} label="Schlage Encode Plus Battery" />
                  <ArcGauge value={sc5Health} color={sc5Color} label="First Alert SC5 Health Score" />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-950/20 py-2">
                  <CheckCircle
                    className="h-3.5 w-3.5 text-emerald-400"
                    style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.7))" }}
                  />
                  <span className="text-[10px] text-zinc-400">All safety checks verified</span>
                </div>
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
