"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchQuiz, submitAnswer } from "@/lib/api";
import { useQuizStore } from "@/store/quizStore";
import { useLanguage } from "@/context/LanguageContext";
import { AnimatePresence, motion } from "motion/react";
import { ProgressBar } from "@/components/ProgressBar";
import { Quiz } from "@/types/types";
import { Check, X } from "lucide-react";

export default function PlayPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { setSession, addAnswer } = useQuizStore();

  const [quiz, setQuiz] = useState<Quiz>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [answersBatch, setAnswersBatch] = useState<
    { questionId: string; selectedOptionIndex: number }[]
  >([]);

  // Charger le quiz
  useEffect(() => {
    if (!quizId) return;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        const data = await fetchQuiz(quizId);

        if (new Date(data.expires_at) < new Date()) {
          setError(t("play.expired"));
          return;
        }

        if (data.partner_completed) {
          setError(t("play.alreadyCompleted"));
          return;
        }

        setQuiz(data);
        setSession({
          quizId: data.id,
          role: "partner",
          token: "",
          expiresAt: data.expires_at,
        });
      } catch (err) {
        setError(t("play.notFound"));
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center p-6 text-center text-sm md:text-base">
        {t("common.loading")}
      </div>
    );

  if (error || !quiz) {
    setInterval(() => {
      router.replace(`/`);
    }, 1500);

    return (
      <div className="flex h-screen w-full items-center justify-center p-6 text-center text-sm text-red-500 md:text-base">
        {error}
      </div>
    );
  }

  const questions = quiz?.questions;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (optionIndex: number) => {
    if (showResult) return;

    setSelectedOption(optionIndex);
    setShowResult(true);

    // Ajouter dans le batch local
    setAnswersBatch((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedOptionIndex: optionIndex },
    ]);

    addAnswer(currentQuestion.id, optionIndex);

    setTimeout(async () => {
      if (isLastQuestion) {
        try {
          const finalBatch = [
            ...answersBatch,
            {
              questionId: currentQuestion.id,
              selectedOptionIndex: optionIndex,
            },
          ];

          await submitAnswer({
            quizId: quiz.id,
            playerType: "partner",
            batch: finalBatch,
          });

          router.push(`/result/${quiz.id}`);
        } catch (err) {
          console.error(err);
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowResult(false);
      }
    }, 1200);
  };

  const getOptionState = (index: number) => {
    if (!showResult) return selectedOption === index ? "selected" : "default";
    if (index === currentQuestion.correct_answer_index) return "correct";
    if (
      selectedOption === index &&
      index !== currentQuestion.correct_answer_index
    )
      return "incorrect";
    return "default";
  };

  const optionStyles = {
    default: "bg-white border-gray-200 text-gray-900",
    selected: "bg-primary/5 border-primary text-primary",
    correct: "bg-success/10 border-success text-success",
    incorrect: "bg-error/10 border-error text-error",
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pt-20 md:px-6 md:pt-6">
      {/* Header */}
      <div className="space-y-4 py-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-gray-900">
            {t("play.title")}
          </h1>

          <p className="text-primary font-serif text-3xl">
            {quiz.creator_name}?
          </p>
        </div>

        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      {/* Question */}
      <div className="flex flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            {/* Question Card */}
            <div className="rounded-3xl bg-white p-4 shadow-lg md:p-6">
              <h3 className="text-center text-xl font-semibold text-gray-900 md:text-2xl">
                {currentQuestion.question_text}
              </h3>
            </div>

            {/* Options - Dynamic Layout Based on Type */}
            {currentQuestion.type === "multiple" ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const state = getOptionState(index);
                  const isDisabled = showResult;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      disabled={isDisabled}
                      whileTap={isDisabled ? {} : { scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 transition-all md:p-5 ${optionStyles[state]} ${
                        isDisabled
                          ? "cursor-default"
                          : "cursor-pointer hover:shadow-md"
                      } `}
                    >
                      <span className="flex-1 text-left text-base font-medium md:text-lg">
                        {option.text}
                      </span>

                      {showResult && state === "correct" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <Check className="hidden h-6 w-6 md:flex" />
                        </motion.div>
                      )}

                      {showResult && state === "incorrect" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <X className="hidden h-6 w-6 md:flex" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const state = getOptionState(index);
                  const isDisabled = showResult;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      disabled={isDisabled}
                      whileTap={isDisabled ? {} : { scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex min-h-22 flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all md:p-8 ${optionStyles[state]} ${
                        isDisabled
                          ? "cursor-default"
                          : "cursor-pointer hover:shadow-lg"
                      } `}
                    >
                      <span className="text-xl font-semibold md:text-2xl">
                        {option.text}
                      </span>

                      {showResult && state === "correct" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                          className="hidden md:flex"
                        >
                          <Check className="h-7 w-7" />
                        </motion.div>
                      )}

                      {showResult && state === "incorrect" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                          className="hidden md:flex"
                        >
                          <X className="h-7 w-7" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feedback Message */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6 text-center"
        >
          <p
            className={`text-base font-medium md:text-lg ${
              selectedOption === currentQuestion.correct_answer_index
                ? "text-success"
                : "text-primary"
            }`}
          >
            {selectedOption === currentQuestion.correct_answer_index
              ? t("play.feedbackCorrect")
              : t("play.feedbackIncorrect")}
          </p>
        </motion.div>
      )}
    </div>
  );
}
