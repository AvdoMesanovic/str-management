"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  Download,
  Droplets,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Home,
  Image as ImageIcon,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  Unlock,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityLog } from "@/components/ActivityLog";
import { Button } from "@/components/ui/button";
import type { AccessCode, Property, UpcomingEvent } from "@/data/mockData";
import { getRiskBadgeClasses } from "@/lib/utils";

interface PropertyDetailViewProps {
  property: Property;
  onBack: () => void;
}

interface CircularProgressProps {
  value: number;
  size?: number;
  color?: string;
}

function CircularProgress({ value, size = 88, color = "#06b6d4" }: CircularProgressProps) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#27272a" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

interface TempGaugeProps {
  value: number;
  label: string;
  color: string;
}

function TempGauge({ value, label, color }: TempGaugeProps) {
  const min = 55;
  const max = 85;
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="relative flex h-20 w-6 items-end overflow-hidden rounded-full bg-zinc-800">
        <div
          className="w-full rounded-full transition-all duration-700"
          style={{ height: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-sm" style={{ color }}>
        {value}°F
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

function Card({ title, subtitle, icon: Icon, children, className = "" }: CardProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 ${className}`}>
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 flex-shrink-0 text-cyan-400" />}
          <span className="text-sm text-white">{title}</span>
        </div>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
      </div>
      <div className="flex flex-1 flex-col p-5">{children}</div>
    </div>
  );
}

function AccessCodeRow({ code }: { code: AccessCode }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <tr className="border-b border-zinc-800 text-xs last:border-0">
      <td className="py-2 pr-4 text-zinc-300">{code.guest}</td>
      <td className="py-2 pr-4 font-mono">
        <span className="flex items-center gap-1.5 text-cyan-400">
          {revealed ? code.code : "••••"}
          <button
            type="button"
            onClick={() => setRevealed(!revealed)}
            className="text-zinc-600 transition-colors hover:text-zinc-300"
            title={revealed ? "Hide code" : "Show code"}
          >
            {revealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </button>
        </span>
      </td>
      <td className="py-2 pr-4 text-zinc-400">{code.checkin}</td>
      <td className="py-2 pr-4 text-zinc-400">{code.checkout}</td>
      <td className="py-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            code.status === "active"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-zinc-700/30 bg-zinc-700/30 text-zinc-500"
          }`}
        >
          {code.status === "active" && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          )}
          {code.status.toUpperCase()}
        </span>
      </td>
    </tr>
  );
}

function EventRow({ event, onToggle }: { event: UpcomingEvent; onToggle: () => void }) {
  return (
    <tr className="border-b border-zinc-800 text-xs last:border-0">
      <td className="py-2 pr-4 text-zinc-300">{event.name}</td>
      <td className="py-2 pr-4 text-zinc-400">{event.date}</td>
      <td className="py-2">
        <button type="button" onClick={onToggle} className="transition-colors" title="Toggle manual override">
          {event.manualOverride ? (
            <ToggleRight className="h-5 w-5 text-cyan-400" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-zinc-600" />
          )}
        </button>
      </td>
    </tr>
  );
}

interface SvgSparkLineProps {
  data: number[];
  color?: string;
  strokeWidth?: number;
}

function SvgSparkLine({ data, color = "#06b6d4", strokeWidth = 2 }: SvgSparkLineProps) {
  const W = 300;
  const H = 80;
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface SvgAreaChartProps {
  data: number[];
  labels: string[];
  unit?: string;
  minY: number;
  maxY: number;
  thresholdY?: number;
  thresholdLabel?: string;
  color?: string;
}

function SvgAreaChart({
  data,
  labels,
  unit = "",
  minY,
  maxY,
  thresholdY,
  thresholdLabel,
  color = "#06b6d4",
}: SvgAreaChartProps) {
  const W = 600;
  const H = 200;
  const PAD = { top: 16, right: 16, bottom: 28, left: 42 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const range = maxY - minY || 1;

  const toX = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * chartW;
  const toY = (v: number) => PAD.top + chartH - ((v - minY) / range) * chartH;

  const linePts = data.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  const firstX = toX(0);
  const lastX = toX(data.length - 1);
  const baseY = PAD.top + chartH;
  const areaPath = [
    `M ${firstX.toFixed(1)} ${baseY.toFixed(1)}`,
    ...data.map((v, i) => `L ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`),
    `L ${lastX.toFixed(1)} ${baseY.toFixed(1)}`,
    "Z",
  ].join(" ");

  const threshY = thresholdY != null ? toY(thresholdY) : null;
  const gridCount = 4;
  const gridYs = Array.from({ length: gridCount - 1 }, (_, i) => PAD.top + chartH * ((i + 1) / gridCount));
  const yTicks = [minY, Math.round((minY + maxY) / 2), maxY];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {gridYs.map((y, i) => (
        <line key={`g${i}`} x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="#27272a" strokeWidth={0.5} />
      ))}
      {threshY != null && (
        <line
          x1={PAD.left}
          y1={threshY}
          x2={PAD.left + chartW}
          y2={threshY}
          stroke="#f59e0b"
          strokeWidth={1}
          strokeDasharray="8 5"
        />
      )}
      {threshY != null && thresholdLabel && (
        <text x={PAD.left + chartW - 4} y={threshY - 5} fill="#f59e0b" fontSize={10} textAnchor="end" fontFamily="monospace">
          {thresholdLabel}
        </text>
      )}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <polyline
        points={linePts}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {thresholdY != null &&
        data.map((v, i) =>
          v > thresholdY ? <circle key={`dot${i}`} cx={toX(i)} cy={toY(v)} r={3.5} fill="#ef4444" /> : null,
        )}
      {labels.map((lbl, i) => {
        const step = Math.max(1, Math.ceil(data.length / 12));
        return i % step === 0 ? (
          <text key={`xl${i}`} x={toX(i)} y={H - 6} fill="#71717a" fontSize={10} textAnchor="middle" fontFamily="monospace">
            {lbl}
          </text>
        ) : null;
      })}
      {yTicks.map((v, i) => (
        <text key={`yl${i}`} x={PAD.left - 6} y={toY(v) + 4} fill="#71717a" fontSize={10} textAnchor="end" fontFamily="monospace">
          {v}
          {unit}
        </text>
      ))}
    </svg>
  );
}

interface SvgGroupedBarProps {
  data: number[][];
  labels: string[];
  colors: string[];
}

function SvgGroupedBar({ data, labels, colors }: SvgGroupedBarProps) {
  const W = 400;
  const H = 100;
  const PAD = { top: 4, right: 4, bottom: 16, left: 28 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const allVals = data.flat().filter((v): v is number => Number.isFinite(v));
  const maxV = allVals.length > 0 ? Math.max(...allVals) : 1;
  const keysCount = data[0]?.length ?? 1;
  const groupW = chartW / labels.length;
  const barW = (groupW * 0.7) / keysCount;
  const groupPad = groupW * 0.15;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
      <line
        x1={PAD.left}
        y1={PAD.top + chartH * 0.5}
        x2={PAD.left + chartW}
        y2={PAD.top + chartH * 0.5}
        stroke="#27272a"
        strokeWidth={1}
      />
      {data.map((group, gi) => {
        const groupX = PAD.left + gi * groupW + groupPad;
        return group.map((val, ki) => {
          const safeVal = Number.isFinite(val) ? val : 0;
          const barH = (safeVal / maxV) * chartH;
          const x = groupX + ki * barW;
          const y = PAD.top + chartH - barH;
          return <rect key={`b${gi}-${ki}`} x={x} y={y} width={barW - 1} height={barH} fill={colors[ki]} rx={2} />;
        });
      })}
      {labels.map((lbl, i) => (
        <text
          key={`xl${i}`}
          x={PAD.left + i * groupW + groupW / 2}
          y={H - 2}
          fill="#71717a"
          fontSize={8}
          textAnchor="middle"
        >
          {lbl}
        </text>
      ))}
      <text x={PAD.left - 2} y={PAD.top + 6} fill="#71717a" fontSize={8} textAnchor="end">
        {Math.round(maxV)}
      </text>
    </svg>
  );
}

export function PropertyDetailView({ property, onBack }: PropertyDetailViewProps) {
  const [events, setEvents] = useState<UpcomingEvent[]>(property.revenue.events);
  const [showFullLog, setShowFullLog] = useState(false);
  const [managerNotes, setManagerNotes] = useState(property.owner.notes);

  useEffect(() => {
    setEvents(property.revenue.events);
  }, [property.revenue.events]);

  const riskStyle = getRiskBadgeClasses(property.riskLevel);

  const taxReadinessColor =
    property.financial.taxReadiness >= 90
      ? "#10b981"
      : property.financial.taxReadiness >= 70
        ? "#f59e0b"
        : "#ef4444";

  const heartbeatValues = property.security.heartbeatData;

  const decibelValues = property.safety.decibelData12h;
  const decibelLabels = decibelValues.map((_, i) => {
    const h = 12 + i;
    const disp = h % 12 === 0 ? 12 : h % 12;
    return `${disp}${h >= 12 && h < 24 ? "p" : "a"}`;
  });

  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const utilData = months.map((_, i) => [
    property.environmental.historicalUtils[i],
    property.environmental.currentUtils[i],
  ]);

  const toggleEvent = (idx: number) => {
    setEvents((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, manualOverride: !e.manualOverride } : e)),
    );
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-zinc-950">
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="px-6 py-4">
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-zinc-500">
            <button type="button" onClick={onBack} className="transition-colors hover:text-cyan-400">
              Properties
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-300">Property ID: {property.id}</span>
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg text-white">{property.address}</h1>
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs ${riskStyle.pill}`}
              >
                <span className={`h-2 w-2 animate-pulse rounded-full ${riskStyle.dot}`} />
                {property.riskLevel.toUpperCase()}: {property.riskReason}
              </span>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800"
                onClick={() => window.open(`mailto:${property.owner.email}`)}
              >
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                Contact Owner
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
              >
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                Edit Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800"
                onClick={() => setShowFullLog(!showFullLog)}
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                {showFullLog ? "Hide" : "View Full"} Property Logs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showFullLog && (
        <div className="border-b border-zinc-800 bg-zinc-950/80">
          <ActivityLog entries={property.activityLog} />
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card
            title="Financial Auditor — Real-Time Tax Engine"
            subtitle="Source: Hospitable / Airbnb / Vrbo APIs"
            icon={TrendingDown}
          >
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                <div className="mb-1 text-xs text-zinc-500">Gross Rent Accrual (Q2)</div>
                <div className="text-xl text-white">${property.financial.grossRent.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="mb-1 text-xs text-zinc-500">3% Fee Liability</div>
                <div className="text-xl text-amber-400">${property.financial.taxLiability.toFixed(2)}</div>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <CircularProgress value={property.financial.taxReadiness} color={taxReadinessColor} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm" style={{ color: taxReadinessColor }}>
                    {property.financial.taxReadiness}%
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-zinc-300">Tax Readiness</div>
                <div className="text-xs text-zinc-500">Calculated vs. required</div>
                <div className="mt-2 text-xs text-zinc-600">
                  Last Sync: <span className="text-emerald-400">{property.financial.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="mb-5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
              <div className="mb-1 text-xs text-zinc-500">Days to Remittance Deadline</div>
              <div className="text-lg text-cyan-400">{property.financial.remittanceDays} days remaining</div>
              <div className="text-xs text-zinc-500">{property.financial.remittancePeriod}</div>
            </div>

            <Button className="w-full border border-cyan-500/30 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
              <Download className="mr-2 h-4 w-4" />
              Download CPA-Ready CSV Export
            </Button>
          </Card>

          <Card
            title="Security & Access Command"
            subtitle="Schlage Encode Plus status · Source: Seam / Allegion APIs"
            icon={Lock}
            className="lg:col-span-2"
          >
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {property.security.lockStatus === "online" ? (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/30">
                        <Lock className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500">Schlage Encode Plus</div>
                        <div className="flex items-center gap-1.5">
                          <Wifi className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="text-sm text-cyan-400">ONLINE</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 ring-1 ring-orange-500/30">
                        <Unlock className="h-6 w-6 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500">Schlage Encode Plus</div>
                        <div className="flex items-center gap-1.5">
                          <WifiOff className="h-3.5 w-3.5 text-orange-400" />
                          <span className="text-sm text-orange-400">OFFLINE</span>
                        </div>
                        <button type="button" className="mt-1 text-xs text-orange-400 underline hover:text-orange-300">
                          Reconnect
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-amber-500/30 bg-amber-500/5 text-xs text-amber-400 hover:bg-amber-500/10"
                  >
                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                    Lock
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-cyan-500/30 bg-cyan-500/5 text-xs text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs text-zinc-400">Lock Responsiveness (24h)</div>
                <div className="mb-2 text-xs text-zinc-600">
                  Last heartbeat: <span className="text-emerald-400">1 min ago</span>
                </div>
                <div className="h-24">
                  <SvgSparkLine data={heartbeatValues} color="#06b6d4" strokeWidth={2} />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs text-zinc-400">Active Code Log</div>
              <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] uppercase text-zinc-600">
                      <th className="py-2 pl-3 pr-4 text-left">Guest</th>
                      <th className="py-2 pr-4 text-left">Code</th>
                      <th className="py-2 pr-4 text-left">Check-In</th>
                      <th className="py-2 pr-4 text-left">Check-Out</th>
                      <th className="py-2 pr-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="pl-3">
                    {property.security.accessCodes.map((code, i) => (
                      <AccessCodeRow key={i} code={code} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <Card
            title="Peace & Safety Suite"
            subtitle="Source: Alertify / Resideo (First Alert) APIs"
            icon={Activity}
            className="lg:col-span-2"
          >
            <div className="mb-5">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Decibel Timeline (Last 12 hours)</span>
                <span className="text-zinc-600">
                  SMS alerts:{" "}
                  {property.safety.smsEnabled ? (
                    <span className="text-emerald-400">ON</span>
                  ) : (
                    <span className="text-red-400">OFF</span>
                  )}
                </span>
              </div>
              <div className="aspect-3/1 w-full">
                <SvgAreaChart
                  data={decibelValues}
                  labels={decibelLabels}
                  unit="dB"
                  minY={25}
                  maxY={90}
                  thresholdY={65}
                  thresholdLabel="Nuisance: 65dB"
                  color="#06b6d4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="mb-3 text-xs text-zinc-400">First Alert SC5 Smart Alarm</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Battery Level</span>
                    <span
                      className={`text-xs font-medium ${
                        property.safety.alarmBattery >= 70
                          ? "text-emerald-400"
                          : property.safety.alarmBattery >= 40
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}
                    >
                      {property.safety.alarmBattery}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        property.safety.alarmBattery >= 70
                          ? "bg-emerald-500"
                          : property.safety.alarmBattery >= 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${property.safety.alarmBattery}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-zinc-500">Last Tested</span>
                    <span className="text-xs text-zinc-400">{property.safety.lastTested}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="border-red-500/30 bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20"
                >
                  <Bell className="mr-1.5 h-3.5 w-3.5" />
                  Trigger Safety Alert SMS
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 hover:bg-amber-500/20"
                >
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  Test SC5 Alarm
                </Button>
                <div className="pt-1 text-center text-xs text-zinc-600">
                  Automated SMS alerts:{" "}
                  <span className={property.safety.smsEnabled ? "text-emerald-400" : "text-red-400"}>
                    {property.safety.smsEnabled ? "ENABLED" : "DISABLED"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Environmental & Asset Protection" subtitle="Source: Ecobee / Phyn APIs" icon={Droplets}>
            <div className="mb-5">
              <div className="mb-2 text-xs text-zinc-400">Leak Detection</div>
              <div
                className={`flex items-center gap-3 rounded-lg border p-4 ${
                  property.environmental.leakStatus === "clear"
                    ? "border-emerald-500/25 bg-emerald-500/10"
                    : "animate-pulse border-red-500/30 bg-red-500/10"
                }`}
              >
                {property.environmental.leakStatus === "clear" ? (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-emerald-400">NO LEAKS DETECTED</div>
                      <div className="text-xs text-zinc-500">
                        Main Valve: <span className="text-emerald-400">Open</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <div className="text-sm text-red-400">CRITICAL LEAK DETECTED</div>
                      <div className="text-xs text-zinc-500">
                        Main Valve: <span className="text-amber-400">{property.environmental.mainValve}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Utility Savings (Last 6 Months)</span>
                <span className="text-emerald-400">−${property.environmental.monthlySavings}/mo</span>
              </div>
              <div className="mb-3 text-xs text-zinc-600">
                Avg. temp adj. while empty: +{property.environmental.avgTempAdj}°F
              </div>
              <div className="h-28">
                <SvgGroupedBar data={utilData} labels={months} colors={["#3f3f46", "#10b981"]} />
              </div>
              <div className="mt-1 flex gap-3 text-xs text-zinc-600">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-zinc-600" />
                  Historical
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500" />
                  Current (optimized)
                </span>
              </div>
            </div>

            <div>
              <div className="mb-3 text-xs text-zinc-400">Current Temperature State</div>
              <div className="flex justify-around">
                <TempGauge value={property.environmental.occupiedTemp} label="Occupied" color="#06b6d4" />
                <TempGauge value={property.environmental.emptyTemp} label="Empty" color="#71717a" />
              </div>
            </div>
          </Card>

          <Card
            title="Active Revenue Management"
            subtitle="Source: Airbnb / PriceLabs APIs"
            icon={TrendingDown}
            className="lg:col-span-2"
          >
            <div className="mb-5 flex flex-wrap gap-3">
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  property.revenue.listingActive
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/25 bg-red-500/10 text-red-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    property.revenue.listingActive ? "animate-pulse bg-emerald-400" : "bg-red-400"
                  }`}
                />
                Airbnb Listing {property.revenue.listingActive ? "Active" : "Inactive"}
              </div>
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  property.revenue.pricelabsSynced
                    ? "border-cyan-500/25 bg-cyan-500/10 text-cyan-400"
                    : "border-amber-500/25 bg-amber-500/10 text-amber-400"
                }`}
              >
                <RefreshCw className="h-3 w-3" />
                PriceLabs {property.revenue.pricelabsSynced ? "Synced" : "Unsynced"}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-500">
                <Calendar className="h-3 w-3" />
                Last update: {property.revenue.lastUpdate}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs text-zinc-400">Event Scouting &amp; Manual Overrides</div>
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/50">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] uppercase text-zinc-600">
                        <th className="py-2 pl-3 pr-3 text-left">Event</th>
                        <th className="py-2 pr-3 text-left">Date</th>
                        <th className="py-2 pr-3 text-left">Override</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((evt, i) => (
                        <EventRow key={i} event={evt} onToggle={() => toggleEvent(i)} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {property.revenue.gapOpportunities.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-2 text-xs text-zinc-400">Gap Opportunities</div>
                    <div className="space-y-1">
                      {property.revenue.gapOpportunities.map((gap, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400"
                        >
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {gap}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-400 hover:bg-cyan-500/20"
                  >
                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                    Create Last-Minute Deal (2-day gap filler)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800/30 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    <TrendingDown className="mr-1.5 h-3.5 w-3.5" />
                    Create Mid-Week Discount
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs text-zinc-400">Listing Freshness</div>
                <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {property.revenue.listingPhotos} listing photos
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 border-zinc-700 bg-zinc-800/30 px-2 text-[10px] text-zinc-300 hover:bg-zinc-800"
                    >
                      Update Photos
                    </Button>
                  </div>
                  <div>
                    <div className="mb-1.5 text-xs text-zinc-500">Description Summary</div>
                    <div className="rounded border border-zinc-800 bg-zinc-900 p-2.5 text-xs leading-relaxed text-zinc-400">
                      {property.revenue.description}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-400 hover:bg-cyan-500/20"
                  >
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                    Update Listing Description
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Owner Information" icon={Home}>
            <div className="mb-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 text-lg text-cyan-400 ring-1 ring-cyan-500/30">
                  {property.owner.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 text-sm text-white">{property.owner.name}</div>
                  <a
                    href={`tel:${property.owner.phone}`}
                    className="mb-1 flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-cyan-400"
                  >
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    {property.owner.phone}
                  </a>
                  <a
                    href={`mailto:${property.owner.email}`}
                    className="flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-cyan-400"
                  >
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{property.owner.email}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 text-xs text-zinc-400">SLA &amp; Documents</div>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2.5 text-xs text-zinc-300 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <FileText className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
                  Copy of Signed SLA (PDF)
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2.5 text-xs text-zinc-300 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  <FileText className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  Property Insurance (PDF)
                </a>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs text-zinc-400">Private Manager Notes</div>
              <textarea
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 transition-colors focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                placeholder="Add private manager notes..."
              />
              <div className="mt-1 text-right">
                <span className="text-[10px] text-zinc-600">Auto-saved locally</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
