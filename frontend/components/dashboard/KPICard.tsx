import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "pink" | "coral" | "purple" | "blue";
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  color = "pink",
}: KPICardProps) {
  const colorClasses = {
    pink: "bg-pink-50 text-pink-600",
    coral: "bg-rose-50 text-rose-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>

        {trend && (
          <div
            className={`text-sm font-medium ${
              trend.isPositive ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}
