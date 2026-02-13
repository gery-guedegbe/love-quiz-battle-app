import { motion } from "motion/react";
import { ListChecks, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TypeSwitcherProps {
  type: "multiple-choice" | "yes-no";
  onChange: (type: "multiple-choice" | "yes-no") => void;
  disabled?: boolean;
}

export function TypeSwitcher({
  type,
  onChange,
  disabled = false,
}: TypeSwitcherProps) {
  const { t } = useLanguage();

  return (
    <div className="inline-flex gap-1 rounded-full bg-gray-100 p-1">
      <button
        onClick={() => onChange("multiple-choice")}
        disabled={disabled}
        className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors md:px-4"
      >
        {type === "multiple-choice" && (
          <motion.div
            layoutId="type-bg"
            className="absolute inset-0 rounded-full bg-white shadow-md"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        <ListChecks
          className={`relative z-10 hidden h-4 w-4 md:flex ${
            type === "multiple-choice" ? "text-primary" : "text-gray-600"
          }`}
        />

        <span
          className={`relative z-10 text-xs md:text-sm lg:text-base ${
            type === "multiple-choice" ? "text-primary" : "text-gray-600"
          }`}
        >
          {t("creation.typeMultiple")}
        </span>
      </button>

      <button
        onClick={() => onChange("yes-no")}
        disabled={disabled}
        className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
      >
        {type === "yes-no" && (
          <motion.div
            layoutId="type-bg"
            className="absolute inset-0 rounded-full bg-white shadow-md"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        <CheckCircle
          className={`relative z-10 hidden h-4 w-4 md:flex ${
            type === "yes-no" ? "text-primary" : "text-gray-600"
          }`}
        />

        <span
          className={`relative z-10 text-xs md:text-sm lg:text-base ${
            type === "yes-no" ? "text-primary" : "text-gray-600"
          }`}
        >
          {t("creation.typeYesNo")}
        </span>
      </button>
    </div>
  );
}
