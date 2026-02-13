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
    <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
      <button
        onClick={() => onChange("multiple-choice")}
        disabled={disabled}
        className="relative px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
      >
        {type === "multiple-choice" && (
          <motion.div
            layoutId="type-bg"
            className="absolute inset-0 bg-white rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        <ListChecks
          className={`w-4 h-4 relative md:flex hidden z-10 ${
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
        className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
      >
        {type === "yes-no" && (
          <motion.div
            layoutId="type-bg"
            className="absolute inset-0 bg-white rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        <CheckCircle
          className={`w-4 h-4 relative md:flex hidden z-10 ${
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
