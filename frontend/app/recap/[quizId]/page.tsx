"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { fetchResults } from "@/lib/api";
import { useQuizStore } from "@/store/quizStore";
import { useLanguage } from "@/context/LanguageContext";
import { Quiz } from "@/types/types";

import { ConversationStartersSlide } from "@/components/ConversationStartersSlide";
import { DataSummarySlide } from "@/components/DataSummarySlide";
import { IntroSlide } from "@/components/IntroSlide";
import { QuestionBreakdownSlide } from "@/components/QuestionBreakdownSlide";

export default function QuizWrappedPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();

  const { role } = useQuizStore();
  const { t, setLanguage } = useLanguage();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  /* =========================
     LOAD QUIZ (LOCAL FIRST)
  ========================== */

  useEffect(() => {
    if (!quizId) return;

    const loadQuiz = async () => {
      try {
        setLoading(true);

        // Check localStorage first
        const localData = localStorage.getItem(`quiz-${quizId}`);
        if (localData) {
          const parsed: Quiz = JSON.parse(localData);

          // Check expiration
          if (new Date(parsed.expires_at) < new Date()) {
            setError("expired");
            return;
          }

          if (parsed.language === "fr" || parsed.language === "en") {
            setLanguage(parsed.language);
          }

          setQuiz(parsed);
          return;
        }

        // Fallback backend
        const data = await fetchResults(quizId);

        if (!data) {
          setError("not_found");
          return;
        }

        if (new Date(data.expires_at) < new Date()) {
          setError("expired");
          return;
        }

        if (data.language === "fr" || data.language === "en") {
          setLanguage(data.language);
        }

        // Save locally
        localStorage.setItem(`quiz-${quizId}`, JSON.stringify(data));

        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError("error");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, setLanguage]);

  /* =========================
     ACCESS CONTROL
  ========================== */

  useEffect(() => {
    if (!role) return;

    if (role !== "creator" && role !== "partner") {
      router.replace("/");
    }
  }, [role, router]);

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable tap navigation on slide 2 (breakdown)
    if (currentSlide === 2) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) handlePrev();
    else if (x > (2 * width) / 3) handleNext();
  };

  const onClose = () => {
    router.push(`/result/${quizId}`);
  };

  /* =========================
     STATES
  ========================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {t("global.loading")}
      </div>
    );
  }

  if (error === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        {t("quizWrapped.expired")}
      </div>
    );
  }

  if (error === "not_found" || error === "error" || !quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        {t("quizWrapped.notAvailable")}
      </div>
    );
  }

  if (!quiz.partner_completed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        {t("quizWrapped.waitingForPartner")}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen overflow-hidden bg-linear-to-br from-[#FFE5E5] via-[#FFF0F5] to-[#F5E6FF]">
      <div className="relative mx-auto h-full max-w-107.5 overflow-y-scroll bg-white/50 shadow-2xl backdrop-blur-xl md:max-w-full">
        {/* Progress */}
        <div className="absolute top-4 right-4 left-4 z-20 flex gap-1">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-sm"
            >
              <motion.div
                className="bg-primary h-full rounded-full"
                animate={{
                  width: i <= currentSlide ? "100%" : "0%",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Close */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm"
        >
          <X className="h-5 w-5 text-gray-900" />
        </motion.button>

        {/* Tap Areas (Mobile Navigation) - DISABLED on slide 2 */}

        {currentSlide !== 2 && (
          <div
            onClick={handleTap}
            className="absolute inset-0 z-10 flex"
            style={{ cursor: "pointer" }}
          >
            <div className="flex-1" />
            <div className="flex-1" />
            <div className="flex-1" />
          </div>
        )}

        {/* Navigation Arrows (Desktop) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-20 flex">
          {currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="pointer-events-auto absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900" />
            </button>
          )}

          {currentSlide < totalSlides - 1 && (
            <button
              onClick={handleNext}
              className="pointer-events-auto absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
            >
              <ChevronRight className="h-6 w-6 text-gray-900" />
            </button>
          )}
        </div>

        {/* Slides */}
        <div className="relative h-full">
          <AnimatePresence mode="wait">
            {currentSlide === 0 && (
              <motion.div key="intro" className="absolute inset-0">
                <IntroSlide quiz={quiz} />
              </motion.div>
            )}

            {currentSlide === 1 && (
              <motion.div
                key="summary"
                className="absolute inset-0 md:relative"
              >
                <DataSummarySlide quiz={quiz} />
              </motion.div>
            )}

            {currentSlide === 2 && (
              <motion.div key="breakdown" className="absolute inset-0">
                <QuestionBreakdownSlide quiz={quiz} />
              </motion.div>
            )}

            {currentSlide === 3 && (
              <motion.div key="starters" className="absolute inset-0">
                <ConversationStartersSlide quiz={quiz} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
