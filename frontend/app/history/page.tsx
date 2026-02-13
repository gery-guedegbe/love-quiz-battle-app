"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Quiz } from "@/types/types";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, Calendar, Clock, Heart, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // =========================
  // LOAD QUIZZES FROM LOCALSTORAGE
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("quiz-"),
      );

      const allQuizzes: Quiz[] = keys
        .map((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          return JSON.parse(raw) as Quiz;
        })
        .filter((quiz): quiz is Quiz => !!quiz);

      if (allQuizzes.length === 0) return;

      // Trier par date de complétion la plus récente
      allQuizzes.sort((a, b) => {
        const dateA = new Date(
          a.partner_completed_at || a.creator_completed_at || 0,
        ).getTime();
        const dateB = new Date(
          b.partner_completed_at || b.creator_completed_at || 0,
        ).getTime();
        return dateB - dateA;
      });

      setTimeout(() => setQuizzes(allQuizzes), 0);
    } catch {
      setTimeout(() => setQuizzes([]), 0);
    }
  }, []);

  // =========================
  // HELPER FUNCTIONS
  // =========================
  const getBadgeColor = (score: number) => {
    if (score >= 90) return "#FF6B6B";
    if (score >= 75) return "#FFD700";
    if (score >= 60) return "#6BCF7F";
    if (score >= 40) return "#FF8B94";
    return "#9CA3AF";
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(
      t("lang") === "fr" ? "fr-FR" : "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  };

  const handleCreateNew = () => {
    // Supprimer l'ancien quiz sélectionné et naviguer vers landing
    localStorage.removeItem("currentQuiz");
    router.push(`/`);
  };

  const handleViewQuizFromHistory = (quizId: string) => {
    const savedQuiz = localStorage.getItem(`quiz-${quizId}`);

    if (savedQuiz) {
      const quiz = JSON.parse(savedQuiz) as Quiz;
      localStorage.setItem("currentQuiz", JSON.stringify(quiz));
      router.push(`/recap/${quiz.id}`);
    }
  };

  // =========================
  // EMPTY STATE
  // =========================
  if (quizzes.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <Clock className="mx-auto h-20 w-20 text-gray-300 md:h-24 md:w-24" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-gray-900">
              {t("history.noMemories")}
            </h2>

            <p className="text-base text-gray-600">
              {t("history.startFirstQuiz")}
            </p>
          </div>

          <motion.button
            onClick={handleCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="from-primary to-primary-light rounded-full bg-linear-to-r px-6 py-4 font-semibold text-white shadow-lg md:px-8"
          >
            {t("history.createNew")}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // =========================
  // QUIZ LIST
  // =========================
  return (
    <div className="mx-auto min-h-screen max-w-md bg-linear-to-b from-[#FAF8F5] to-white p-4 md:bg-none md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 pb-6"
      >
        <div className="mb-2 flex items-center gap-2 md:gap-3">
          <Clock className="text-primary h-7 w-7 md:h-8 md:w-8" />

          <h1 className="font-serif text-3xl text-gray-900">
            {t("history.title")}
          </h1>
        </div>

        <p className="text-gray-600">{t("history.subtitle")}</p>
      </motion.div>

      {/* Quiz List */}
      <div className="space-y-4 pb-24">
        {quizzes.map((quiz, index) => {
          const isCompleted = !!quiz.partner_completed;
          const score = quiz.partner_score || 0;

          return (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => handleViewQuizFromHistory(quiz.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hover:border-primary/30 relative w-full rounded-3xl border-2 border-gray-100 bg-white/80 p-4 text-left shadow-lg backdrop-blur-sm transition-all md:p-6"
              >
                {/* Question Count Badge */}
                <div className="absolute top-6 right-6">
                  <div className="bg-primary/10 rounded-full px-3 py-1">
                    <span className="text-primary text-xs font-semibold">
                      {quiz.questions.length} Q
                    </span>
                  </div>
                </div>

                {/* Header: Names */}
                <div className="mb-4 flex items-start justify-between pr-16">
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {quiz.creator_name}
                      </span>

                      <Heart className="text-primary fill-pritext-primary h-4 w-4" />

                      <span className="font-semibold text-gray-900">
                        {quiz.partner_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />

                      <span>{formatDate(quiz.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Status: Completed or Pending */}
                {isCompleted ? (
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="text-custom-yellow h-5 w-5" />

                      <span className="text-sm text-gray-600">
                        {t("history.completed")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="font-serif text-2xl"
                        style={{ color: getBadgeColor(score) }}
                      >
                        {score}%
                      </div>

                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="text-custom-yellow h-5 w-5" />

                      <span className="text-sm text-gray-600">
                        {t("history.waitingFor").replace(
                          "{partner}",
                          quiz.partner_name,
                        )}
                      </span>
                    </div>

                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Create New Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed right-6 bottom-6 left-6 mx-auto max-w-md"
      >
        <button
          onClick={handleCreateNew}
          className="from-primary to-primary-light flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r px-6 py-4 font-semibold text-white shadow-xl transition-shadow hover:shadow-2xl"
        >
          <span>{t("history.createNew")}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </motion.div>
    </div>
  );
}
