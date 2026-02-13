import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GrowthChartProps {
  data: { date: string; count: number }[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickLine={{ stroke: "#E5E7EB" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#F472B6"
            strokeWidth={3}
            dot={{ fill: "#F472B6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
