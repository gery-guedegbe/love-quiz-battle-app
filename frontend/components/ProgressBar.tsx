import { useLanguage } from "@/context/LanguageContext";
import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useLanguage();
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          {t("creation.questionOf")} {current} {t("setup.stepOf").toLowerCase()}{" "}
          {total}
        </span>

        <span className="text-sm font-medium text-primary">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-primary to-primary-light"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
