import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "px-4 md:px-6 py-4 rounded-full font-medium transition-all text-base min-h-[44px] flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-95",
    secondary:
      "bg-white text-primary border-2 border-primary hover:bg-primary/5 active:scale-95",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 active:scale-95",
  };

  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:shadow-lg active:scale-100";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${disabled || loading ? disabledStyles : ""}
        ${fullWidth ? "w-full" : ""}
      `}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </motion.button>
  );
}
