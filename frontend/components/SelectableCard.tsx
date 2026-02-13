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
      className={`relative min-h-11 w-full rounded-3xl border-2 p-5 text-left transition-all md:p-6 ${
        selected
          ? "bg-primary/5 border-primary shadow-lg"
          : "border-gray-200 bg-white shadow-sm hover:border-gray-300"
      } `}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div
            className={`text-base font-semibold md:text-lg ${selected ? "text-primary" : "text-gray-900"}`}
          >
            {label}
          </div>

          {description && (
            <div className="mt-1 text-sm text-gray-500">{description}</div>
          )}
        </div>

        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "bg-primary border-primary" : "border-gray-300"} `}
        >
          {selected && <Check className="h-4 w-4 text-white" />}
        </div>
      </div>
    </motion.button>
  );
}
