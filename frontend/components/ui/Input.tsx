import { useState } from "react";
import { motion } from "motion/react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  type?: "text" | "email";
  maxLength?: number;
}

export function Input({
  value,
  onChange,
  placeholder,
  label,
  error,
  type = "text",
  maxLength,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full px-4 md:px-6 py-4 rounded-2xl border-2 bg-white
            transition-all outline-none text-base min-h-11
            ${
              error
                ? "border-primary-light focus:border-primary-light focus:ring-4 focus:ring-primary-light/20"
                : isFocused
                  ? "border-primary ring-4 ring-primary/20"
                  : "border-gray-200 hover:border-gray-300"
            }
            ${value ? "pt-6 pb-2" : ""}
          `}
        />
        {label && value && (
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-6 top-2 text-xs text-gray-500"
          >
            {label}
          </motion.label>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-primary-light mt-2 ml-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
