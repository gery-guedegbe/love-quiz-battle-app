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
      className="w-full bg-white rounded-3xl shadow-lg border-2 border-dashed border-gray-300 p-6 md:p-8 hover:border-primary hover:shadow-xl transition-all min-h-50 flex flex-col items-center justify-center gap-3"
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
        <Plus className="w-8 md:w-12 h-8 md:h-12 text-gray-400" />
      </motion.div>

      <div className="text-center space-y-2">
        <h4 className="text-lg font-semibold text-gray-900 mb-1">
          {t("creation.customTitle")}
          {index + 1}
        </h4>

        <p className="text-sm text-gray-500">{t("creation.customSubtitle")}</p>
      </div>

      <div className="flex items-center gap-1 text-xs text-primary font-medium">
        <Sparkles className="w-3 h-3" />
        <span>{t("creation.customBadge")}</span>
      </div>
    </motion.button>
  );
}
