import { motion } from "motion/react";
import { Plus, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CustomQuestionPlaceholderProps {
  index: number;
  onClick: () => void;
}

export function CustomQuestionPlaceholder({
  index,
  onClick,
}: CustomQuestionPlaceholderProps) {
  const { t } = useLanguage();

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="hover:border-primary flex min-h-50 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8"
    >
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <Plus className="h-8 w-8 text-gray-400 md:h-12 md:w-12" />
      </motion.div>

      <div className="space-y-2 text-center">
        <h4 className="mb-1 text-lg font-semibold text-gray-900">
          {t("creation.customTitle")}
          {index + 1}
        </h4>

        <p className="text-sm text-gray-500">{t("creation.customSubtitle")}</p>
      </div>

      <div className="text-primary flex items-center gap-1 text-xs font-medium">
        <Sparkles className="h-3 w-3" />
        <span>{t("creation.customBadge")}</span>
      </div>
    </motion.button>
  );
}
