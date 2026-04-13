"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

interface HealthSparklineProps {
  data: number[];
  color: string;
  label: string;
  unit: string;
}

export function HealthSparkline({ data, color, label, unit }: HealthSparklineProps) {
  const chartData = data.slice(-12).map((value, index) => ({ value, index }));

  const currentValue = data[data.length - 1];
  const previousValue = data[data.length - 2];
  const trend = currentValue > previousValue ? "↑" : currentValue < previousValue ? "↓" : "→";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0 text-right">
        <div className="text-xs text-zinc-500">{label}</div>
        <div className="text-sm" style={{ color }}>
          {currentValue}
          {unit} {trend}
        </div>
      </div>
      <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
