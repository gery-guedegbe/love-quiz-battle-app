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
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          {t("creation.questionOf")} {current} {t("setup.stepOf").toLowerCase()}{" "}
          {total}
        </span>

        <span className="text-primary text-sm font-medium">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="from-primary to-primary-light h-full bg-linear-to-r"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
