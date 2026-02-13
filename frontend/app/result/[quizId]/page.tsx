"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchResults } from "@/lib/api";
import { useQuizStore } from "@/store/quizStore";
import { Quiz } from "@/types/types";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Share2 } from "lucide-react";
import ViewRecapCTA from "@/components/ViewRecapCTA";

export default function ResultPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const { t, setLanguage } = useLanguage();

  const { reset } = useQuizStore();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH QUIZ SECURE
  ========================== */

  useEffect(() => {
    if (!quizId) return;

    const loadQuiz = async () => {
      try {
        setLoading(true);

        const data = await fetchResults(quizId);

        // console.log("Play Data : ", data);

        if (!data) {
          setError("Quiz not found");
          return;
        }

        // Synchroniser la langue du quiz avec i18n
        if (data.language === "fr" || data.language === "en") {
          setLanguage(data.language);
        }

        setQuiz(data);

        // Stocker le quiz dans le localStorage
        if (typeof window !== "undefined" && data.id) {
          localStorage.setItem(`quiz-${data.id}`, JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, setLanguage]);

  /* =========================
     SCORE LOGIC
  ========================== */

  const score = quiz?.partner_score ?? 0;

  // const correctAnswers = useMemo(() => {
  //   if (!quiz) return 0;
  //   return Math.round((score / 100) * quiz.question_count);
  // }, [quiz, score]);

  // const wrongAnswers = useMemo(() => {
  //   if (!quiz) return 0;
  //   return quiz.question_count - correctAnswers;
  // }, [quiz, correctAnswers]);

  /* =========================
     BADGE LOGIC
  ========================== */

  const badge = useMemo(() => {
    if (score >= 90)
      return { title: t("results.soulmates"), color: "#FF6B6B", emoji: "💕" };
    if (score >= 75)
      return { title: t("results.bestFriends"), color: "#FFD700", emoji: "✨" };
    if (score >= 60)
      return {
        title: t("results.gettingThere"),
        color: "#6BCF7F",
        emoji: "🌟",
      };
    if (score >= 40)
      return { title: t("results.roomToGrow"), color: "#FF8B94", emoji: "🌱" };

    return {
      title: t("results.strangerThings"),
      color: "#9CA3AF",
      emoji: "👀",
    };
  }, [score, t]);

  /* =========================
     SHARE
  ========================== */

  const handleShare = async () => {
    if (!quiz) return;

    const text = t("results.shareText")
      .replace("{score}", String(score))
      .replace("{name}", quiz.creator_name);

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Love Quiz Battle", text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        alert(t("results.linkCopied"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onPlayAgain = () => {
    reset();
    router.push("/");
  };

  /* =========================
     LOADING / ERROR UI
  ========================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("common.loading")}
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {t("common.error")}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-6 max-w-md mx-auto">
      {/* Confetti Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 1 }}
            animate={{
              y: window.innerHeight + 20,
              x: Math.sin(i) * 100,
              rotate: 360,
              opacity: 0,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: "24px",
            }}
          >
            {
              ["🎉", "💕", "⭐", "✨", "💖", "🎊"][
                Math.floor(Math.random() * 6)
              ]
            }
          </motion.div>
        ))}
      </div>

      {/* Results Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8 pt-18 md:pt-6 relative z-10">
        {/* Score Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative"
        >
          <svg className="w-48 h-48 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />

            {/* Progress Circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke={badge.color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * score) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                strokeDasharray: 553,
              }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div
                className="text-4xl md:text-5xl lg:text-6xl font-serif"
                style={{ color: badge.color }}
              >
                {score}%
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <div className="text-5xl md:text-5xl">{badge.emoji}</div>

          <div>
            <h2
              className="text-4xl font-serif mb-2"
              style={{ color: badge.color }}
            >
              {badge.title}
            </h2>

            <p className="text-lg text-gray-600">
              {t("results.knowsWell")
                .replace("{partner}", quiz.partner_name)
                .replace("{creator}", quiz.creator_name)}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-3xl shadow-lg p-4 md:p-6 w-full"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1.5 md:space-y-2">
              <div className="text-2xl font-serif text-[#FF6B6B]">
                {Math.round((score / 100) * quiz.question_count)}
              </div>

              <div className="text-sm text-gray-600">
                {t("results.correct")}
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <div className="text-2xl font-serif text-gray-400">
                {quiz.question_count -
                  Math.round((score / 100) * quiz.question_count)}
              </div>

              <div className="text-sm text-gray-600">{t("results.wrong")}</div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <div className="text-2xl font-serif text-gray-900">
                {quiz.question_count}
              </div>

              <div className="text-sm text-gray-600">{t("results.total")}</div>
            </div>
          </div>
        </motion.div>

        <ViewRecapCTA />
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full pt-6 space-y-3 pb-6"
      >
        <Button onClick={handleShare} fullWidth>
          <Share2 className="w-5 h-5" />
          {t("results.shareButton")}
        </Button>

        <Button onClick={onPlayAgain} variant="secondary" fullWidth>
          <RotateCcw className="w-5 h-5" />
          {t("results.playAgainButton")}
        </Button>
      </motion.div>
    </div>
  );
}
