"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SparklesIcon } from "lucide-react";
import { Quiz } from "@/types/types";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const ViewRecapCTA = () => {
  const { t } = useLanguage();
  const router = useRouter();

  const [latestQuiz, setLatestQuiz] = useState<Quiz | null>(null);

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

      if (completedQuizzes.length === 0) return;

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

  const handleViewWrapped = () => {
    if (!latestQuiz) return;

    // Navigation vers recap dynamique
    router.push(`/recap/${latestQuiz.id}`);
  };

  if (!latestQuiz) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
      className="w-full"
    >
      <motion.button
        onClick={handleViewWrapped}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-4 md:p-6 bg-linear-to-r from-primary to-primary-light rounded-3xl shadow-xl flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>

          <div className="text-left">
            <p className="text-white font-semibold text-base md:text-lg">
              {t("recap.cta.title")}
            </p>

            <p className="text-white/80 text-sm">{t("recap.cta.subtitle")}</p>
          </div>
        </div>

        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className=""
        >
          <SparklesIcon className="w-5 h-5 text-white" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default ViewRecapCTA;
