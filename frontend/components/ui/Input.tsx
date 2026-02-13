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
          className={`min-h-11 w-full rounded-2xl border-2 bg-white px-4 py-4 text-base transition-all outline-none md:px-6 ${
            error
              ? "border-primary-light focus:border-primary-light focus:ring-primary-light/20 focus:ring-4"
              : isFocused
                ? "border-primary ring-primary/20 ring-4"
                : "border-gray-200 hover:border-gray-300"
          } ${value ? "pt-6 pb-2" : ""} `}
        />
        {label && value && (
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 left-6 text-xs text-gray-500"
          >
            {label}
          </motion.label>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary-light mt-2 ml-2 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
