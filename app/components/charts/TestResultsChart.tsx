"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";

interface TestResultData {
  name: string;
  value: number;
  color: string;
}

interface TestResultsChartProps {
  passed: number;
  warning: number;
  failed: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: TestResultData;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-(--border-color) bg-(--surface-bg) p-3 shadow-lg">
        <p className="text-sm font-semibold text-(--text-primary)">
          {payload[0].name}
        </p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {payload[0].value} tests
        </p>
      </div>
    );
  }
  return null;
};

export default function TestResultsChart({
  passed,
  warning,
  failed,
}: TestResultsChartProps) {
  const data: TestResultData[] = [
    { name: "Passed", value: passed, color: "var(--status-success)" },
    { name: "Warning", value: warning, color: "var(--status-warning)" },
    { name: "Failed", value: failed, color: "var(--error)" },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-50 items-center justify-center">
        <p className="text-sm text-(--text-muted)">No test data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value: string | undefined, entry: LegendPayload) => {
            const customPayload = entry.payload as unknown as TestResultData;
            return (
              <span style={{ color: "var(--text-primary)", fontSize: "12px" }}>
                {value}: {customPayload.value}
              </span>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
