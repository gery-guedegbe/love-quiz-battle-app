import { motion } from "motion/react";
import { Check } from "lucide-react";

interface SelectableCardProps {
  value: string | number;
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
}

export function SelectableCard({
  value,
  label,
  selected,
  onClick,
  description,
}: SelectableCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`
        relative p-5 md:p-6 rounded-3xl border-2 transition-all text-left w-full min-h-11
        ${
          selected
            ? "bg-primary/5 border-primary shadow-lg"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
        }
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div
            className={`font-semibold text-base md:text-lg ${selected ? "text-primary" : "text-gray-900"}`}
          >
            {label}
          </div>

          {description && (
            <div className="text-sm text-gray-500 mt-1">{description}</div>
          )}
        </div>

        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
            ${selected ? "bg-primary border-primary" : "border-gray-300"}
          `}
        >
          {selected && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>
    </motion.button>
  );
}
