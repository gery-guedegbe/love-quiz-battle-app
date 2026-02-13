"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Quiz } from "@/types/types";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export function RecapHeaderButton() {
  const { t } = useLanguage();
  const router = useRouter();

  const [latestQuiz, setLatestQuiz] = useState<Quiz | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleClicked = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    router.push(`/recap/${quiz.id}`);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("quiz-"),
      );

      const completedQuizzes: Quiz[] = keys
        .map((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          return JSON.parse(raw) as Quiz;
        })
        .filter(
          (quiz): quiz is Quiz =>
            !!quiz && quiz.partner_completed && !!quiz.partner_completed_at,
        );

      console.log("Reacap Quiz Data", completedQuizzes);

      if (completedQuizzes.length === 0) return;

      // Trier par date la plus récente
      completedQuizzes.sort(
        (a, b) =>
          new Date(b.partner_completed_at).getTime() -
          new Date(a.partner_completed_at).getTime(),
      );

      setTimeout(() => setLatestQuiz(completedQuizzes[0]), 0);
    } catch {
      setTimeout(() => setLatestQuiz(null), 0);
    }
  }, []);

  if (!latestQuiz) return null;

  return (
    <motion.button
      onClick={() => handleClicked(latestQuiz)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-gray-200 hover:border-primtext-primary transition-colors"
    >
      <Sparkles className="w-4 h-4 text-primary" />

      <span className="text-sm font-semibold text-gray-900">
        {t("recap.button")}
      </span>
    </motion.button>
  );
}
