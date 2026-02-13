import { motion } from "motion/react";

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({
  options,
  selected,
  onChange,
}: SegmentedControlProps) {
  return (
    <div className="inline-flex gap-1 rounded-full bg-gray-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className="relative min-h-11 min-w-11 rounded-full px-6 py-2 text-sm font-medium transition-colors"
        >
          {selected === option.value && (
            <motion.div
              layoutId="segmented-bg"
              className="absolute inset-0 rounded-full bg-white shadow-md"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}

          <span
            className={`relative z-10 ${
              selected === option.value ? "text-primary" : "text-gray-600"
            }`}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
