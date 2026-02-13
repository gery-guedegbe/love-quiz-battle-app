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
        className="from-primary to-primary-light group flex w-full items-center justify-between rounded-3xl bg-linear-to-r p-4 shadow-xl md:p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>

          <div className="text-left">
            <p className="text-base font-semibold text-white md:text-lg">
              {t("recap.cta.title")}
            </p>

            <p className="text-sm text-white/80">{t("recap.cta.subtitle")}</p>
          </div>
        </div>

        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className=""
        >
          <SparklesIcon className="h-5 w-5 text-white" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default ViewRecapCTA;
