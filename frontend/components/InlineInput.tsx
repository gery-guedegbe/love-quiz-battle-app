import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

interface InlineInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  maxLength?: number;
}

export function InlineInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  className = "",
  maxLength,
}: InlineInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
    if (e.key === "Escape") {
      handleBlur();
    }
  };

  if (!isEditing) {
    return (
      <motion.div
        onClick={() => setIsEditing(true)}
        whileHover={{ scale: 1.01 }}
        className={`cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors ${className}`}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
      </motion.div>
    );
  }

  const baseStyles =
    "w-full bg-white border-2 border-primary rounded-lg px-3 py-2 outline-none ring-4 ring-primary/20 transition-all";

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={2}
        className={`${baseStyles} ${className} resize-none`}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${baseStyles} ${className}`}
    />
  );
}
