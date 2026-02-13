import { motion } from "motion/react";
import { Target, CheckCircle, Award } from "lucide-react";
import { Quiz } from "@/types/types";
import { useLanguage } from "@/context/LanguageContext";

interface DataSummarySlideProps {
  quiz: Quiz;
}

export function DataSummarySlide({ quiz }: DataSummarySlideProps) {
  const { t } = useLanguage();

  // Source of truth = backend
  const score = quiz.partner_score ?? 0;

  const totalQuestions = quiz.question_count ?? quiz.questions.length;

  // Convert percentage to correct answers
  const correctAnswers = Math.round((score / 100) * totalQuestions);

  const getBadgeColor = (score: number) => {
    if (score >= 90) return "#FF6B6B";
    if (score >= 75) return "#FFD700";
    if (score >= 60) return "#6BCF7F";
    if (score >= 40) return "#FF8B94";
    return "#9CA3AF";
  };

  const badgeColor = getBadgeColor(score);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-linear-to-br from-white via-[#FFE5E5]/30 to-white p-8">
      <div className="w-full max-w-sm space-y-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="mb-2 font-serif text-3xl text-gray-900">
            {t("results.dataSummary.title")}
          </h2>

          <p className="text-gray-600">
            {t("results.dataSummary.subtitle", {
              partner: quiz.partner_name,
              creator: quiz.creator_name,
            })}
          </p>
        </motion.div>

        {/* Progress Ring */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.4,
          }}
          className="relative mx-auto flex items-center justify-center text-center"
        >
          <svg className="h-64 w-64 -rotate-90 transform">
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={badgeColor} />
                <stop offset="100%" stopColor={badgeColor} stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Background */}
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="#E5E7EB"
              strokeWidth="16"
              fill="none"
            />

            {/* Animated Progress */}
            <motion.circle
              cx="128"
              cy="128"
              r="110"
              stroke="url(#progressGradient)"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 691 }}
              animate={{ strokeDashoffset: 691 - (691 * score) / 100 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.6 }}
              style={{
                strokeDasharray: 691,
                filter: "drop-shadow(0 4px 12px rgba(255, 107, 107, 0.3))",
              }}
            />
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div
                className="mb-2 font-serif text-7xl"
                style={{ color: badgeColor }}
              >
                {score}%
              </div>

              <div className="text-sm font-medium text-gray-600">
                {t("results.dataSummary.matchScore")}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="rounded-3xl bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm">
            <Target className="text-primary mx-auto mb-2 h-6 w-6" />

            <div className="font-serif text-2xl text-gray-900">
              {totalQuestions}
            </div>

            <div className="text-xs text-gray-600">
              {t("results.dataSummary.questions")}
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm">
            <CheckCircle className="text-success mx-auto mb-2 h-6 w-6" />

            <div className="text-success font-serif text-2xl">
              {correctAnswers}
            </div>

            <div className="text-xs text-gray-600">
              {t("results.dataSummary.correct")}
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm">
            <Award className="text-custom-yellow mx-auto mb-2 h-6 w-6" />

            <div className="font-serif text-2xl text-gray-900">
              {quiz.questions.length}
            </div>

            <div className="text-xs text-gray-600">
              {t("results.dataSummary.total")}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
