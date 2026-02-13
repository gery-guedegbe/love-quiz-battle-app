import { motion } from "motion/react";
import { CheckCircle, XCircle, Sparkles } from "lucide-react";
import { Quiz } from "@/types/types";
import { useLanguage } from "@/context/LanguageContext";

interface QuestionBreakdownSlideProps {
  quiz: Quiz;
}

export function QuestionBreakdownSlide({ quiz }: QuestionBreakdownSlideProps) {
  const { t } = useLanguage();

  // Sécurité : quiz pas complété
  if (!quiz.partner_completed || !quiz.answers?.length) {
    return null;
  }

  // On ne garde que les réponses du partner
  const partnerAnswers = quiz.answers.filter(
    (a) => a.player_type === "partner",
  );

  const results = quiz.questions.map((question, index) => {
    const answer = partnerAnswers.find((a) => a.question_id === question.id);

    const selectedIndex = answer?.selected_option_index;
    const isCorrect =
      selectedIndex !== undefined &&
      selectedIndex === question.correct_answer_index;

    return {
      question: question.question_text,
      userAnswer: selectedIndex !== undefined ? selectedIndex : null,
      correctAnswer: question.correct_answer_index,
      isCorrect,
      isCustom: (question as any).isCustom || false,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = results.length - correctCount;

  return (
    <div className="flex h-full flex-col bg-linear-to-br from-white to-[#F5F5F5] p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-6 text-center"
      >
        <h2 className="mb-2 font-serif text-3xl text-gray-900">
          {t("results.breakdown.title")}
        </h2>

        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="text-success h-4 w-4" />

            <span className="text-gray-600">
              {correctCount} {t("results.breakdown.matches")}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <XCircle className="text-primary h-4 w-4" />

            <span className="text-gray-600">
              {incorrectCount} {t("results.breakdown.misses")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Scrollable List */}
      <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto pb-6">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-3xl p-4 shadow-md md:p-5 ${
              result.isCorrect
                ? "border-2 border-[#6BCF7F]/30 bg-linear-to-br from-[#6BCF7F]/10 to-white"
                : "from-primary-border-primary-light/10 border-primary-light/30 border-2 bg-linear-to-br to-white"
            } `}
          >
            {/* Custom Badge */}
            {result.isCustom && (
              <div className="absolute top-3 right-3">
                <div className="bg-primary/10 flex items-center gap-1 rounded-full px-2 py-1">
                  <Sparkles className="text-primary h-3 w-3" />

                  <span className="text-primary text-xs font-medium">
                    {t("results.breakdown.custom")}
                  </span>
                </div>
              </div>
            )}

            {/* Question */}
            <div className="mb-3 flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                {index + 1}
              </div>

              <p className="flex-1 text-sm leading-relaxed font-medium text-gray-900 md:text-base">
                {result.question}
              </p>
            </div>

            {/* Result */}
            {result.isCorrect ? (
              <div className="flex items-center gap-2 pl-9">
                <CheckCircle className="text-success h-5 w-5" />

                <div className="flex-1">
                  <p className="text-success text-sm font-semibold">
                    {t("results.breakdown.perfect")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pl-9">
                <div className="flex items-start gap-2">
                  <XCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />

                  <div className="flex-1">
                    <p className="text-xs text-gray-500">
                      {t("results.breakdown.theyAnswered")}
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {result.userAnswer !== null
                        ? result.userAnswer
                        : t("results.breakdown.noAnswer")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="text-success mt-0.5 h-5 w-5 shrink-0" />

                  <div className="flex-1">
                    <p className="text-xs text-gray-500">
                      {t("results.breakdown.correctAnswer")}
                    </p>

                    <p className="text-success text-sm font-semibold">
                      {result.correctAnswer}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
