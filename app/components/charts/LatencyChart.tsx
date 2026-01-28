"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LatencyDataPoint {
  timestamp: string;
  latency: number;
  label: string;
}

interface LatencyChartProps {
  data: LatencyDataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-(--border-color) bg-(--surface-bg) p-3 shadow-lg">
        <p className="text-sm font-semibold text-(--text-primary)">
          {payload[0].payload.label}
        </p>
        <p className="text-sm text-accent">
          {payload[0].value}ms
        </p>
      </div>
    );
  }
  return null;
};

export default function LatencyChart({ data }: LatencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border-color)"
          opacity={0.3}
        />
        <XAxis
          dataKey="label"
          stroke="var(--text-muted)"
          style={{ fontSize: "12px" }}
          tick={{ fill: "var(--text-muted)" }}
        />
        <YAxis
          stroke="var(--text-muted)"
          style={{ fontSize: "12px" }}
          tick={{ fill: "var(--text-muted)" }}
          label={{ value: "ms", angle: -90, position: "insideLeft" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="latency"
          stroke="var(--accent)"
          strokeWidth={2}
          dot={{ fill: "var(--accent)", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
