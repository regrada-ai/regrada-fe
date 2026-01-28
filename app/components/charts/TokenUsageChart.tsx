"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TokenDataPoint {
  timestamp: string;
  tokens: number;
  label: string;
}

interface TokenUsageChartProps {
  data: TokenDataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-(--border-color) bg-(--surface-bg) p-3 shadow-lg">
        <p className="text-sm font-semibold text-(--text-primary)">
          {payload[0].payload.label}
        </p>
        <p className="text-sm text-(--accent)">
          {payload[0].value?.toLocaleString()} tokens
        </p>
      </div>
    );
  }
  return null;
};

export default function TokenUsageChart({ data }: TokenUsageChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="tokens"
          fill="var(--accent)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
