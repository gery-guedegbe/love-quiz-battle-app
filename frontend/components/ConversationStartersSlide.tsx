import { motion } from "motion/react";
import { MessageCircle, Heart, Lightbulb } from "lucide-react";
import { Quiz } from "@/types/types";
import { useLanguage } from "@/context/LanguageContext";

interface ConversationStartersSlideProps {
  quiz: Quiz;
}

export function ConversationStartersSlide({
  quiz,
}: ConversationStartersSlideProps) {
  const { t } = useLanguage();

  // Sécurité : quiz non complété
  if (!quiz.partner_completed) return null;

  const score = quiz.partner_score ?? 0;

  const getConversationStarters = (score: number) => {
    if (score >= 90) {
      return [
        t("results.conversation.high.0"),
        t("results.conversation.high.1"),
        t("results.conversation.high.2"),
      ];
    } else if (score >= 75) {
      return [
        t("results.conversation.good.0"),
        t("results.conversation.good.1"),
        t("results.conversation.good.2"),
      ];
    } else if (score >= 60) {
      return [
        t("results.conversation.medium.0"),
        t("results.conversation.medium.1"),
        t("results.conversation.medium.2"),
      ];
    } else {
      return [
        t("results.conversation.low.0"),
        t("results.conversation.low.1"),
        t("results.conversation.low.2"),
      ];
    }
  };

  const starters = getConversationStarters(score);

  return (
    <div className="to-primary/10 flex h-full flex-col items-center justify-center bg-linear-to-br from-[#FFD700]/10 via-white px-4 pt-12 md:px-8 md:pt-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mb-4 inline-block"
          >
            <MessageCircle className="text-primary h-14 w-14 md:h-16 md:w-16" />
          </motion.div>

          <h2 className="mb-2 font-serif text-3xl text-gray-900">
            {t("results.conversation.title")}
          </h2>

          <p className="text-gray-600">{t("results.conversation.subtitle")}</p>
        </motion.div>

        {/* Conversation Starters */}
        <div className="space-y-4">
          {starters.map((starter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.15 }}
              className="relative"
            >
              <div className="hover:border-primary/30 rounded-3xl border-2 border-gray-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-colors md:p-6">
                <div className="flex items-center gap-4">
                  <div className="from-primary to-primary-light flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br">
                    {index === 0 && (
                      <Lightbulb className="h-4 w-4 text-white" />
                    )}

                    {index === 1 && (
                      <MessageCircle className="h-4 w-4 text-white" />
                    )}

                    {index === 2 && <Heart className="h-4 w-4 text-white" />}
                  </div>

                  <p className="flex-1 text-sm leading-relaxed font-medium text-gray-900 md:text-base">
                    {starter}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-3 pt-4 text-center"
        >
          <div className="from-primary to-primary-light inline-flex items-center gap-2 rounded-full bg-linear-to-r px-6 py-3 shadow-lg">
            <Heart className="h-5 w-5 fill-white text-white" />

            <span className="font-semibold text-white">
              {quiz.creator_name} & {quiz.partner_name}
            </span>
          </div>

          <motion.button
            onClick={() => {}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-linear-to-r from-[#FF6B6B] to-[#FF8B94] px-6 py-3 font-semibold text-white shadow-lg"
          >
            {t("results.conversation.create")}
          </motion.button>

          <p className="mt-4 text-xs text-gray-500">
            {t("results.conversation.footer")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
