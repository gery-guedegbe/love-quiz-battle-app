"use client";

import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Quiz } from "@/types/types";
import { useEffect, useState } from "react";

export function HistoryHeaderButton() {
  const { t } = useLanguage();
  const router = useRouter();
  const [hasQuizzes, setHasQuizzes] = useState(false);

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window !== "undefined") {
      // Récupérer les clés localStorage à l'intérieur du useEffect
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

      setTimeout(() => {
        setHasQuizzes(allQuizzes.length > 0);
      }, 0);
    }
  }, []); // Tableau de dépendances vide = s'exécute 1 fois au montage

  const handleClicked = () => {
    router.push(`/history`);
  };

  return (
    <>
      {hasQuizzes ? (
        <motion.button
          onClick={handleClicked}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hover:border-primary flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm transition-colors md:px-4"
        >
          <Clock className="text-primary h-4 w-4" />
          <span className="text-sm font-semibold text-gray-900">
            {t("history.button")}
          </span>
        </motion.button>
      ) : (
        <div></div> // Rien n'est affiché s'il n'y a pas de quizzes
      )}
    </>
  );
}
