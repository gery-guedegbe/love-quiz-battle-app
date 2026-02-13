import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ScoreDistributionChartProps {
  data: { label: string; count: number; range: string }[];
}

const COLORS = ["#9CA3AF", "#F59E0B", "#10B981", "#F472B6", "#EC4899"];

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            tickLine={{ stroke: "#E5E7EB" }}
            angle={-15}
            textAnchor="end"
            height={60}
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
            formatter={(value: any, name: any, props: any) => {
              // Gestion sécurisée des valeurs
              const formattedValue = `${value || 0} quizzes`;
              const range = props?.payload?.range || "";
              return [formattedValue, range];
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
