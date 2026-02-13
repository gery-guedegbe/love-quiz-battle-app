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
      <div className="p-6 text-center flex items-center justify-center w-full h-screen text-sm md:text-base">
        {t("common.loading")}
      </div>
    );

  if (error || !quiz) {
    setInterval(() => {
      router.replace(`/`);
    }, 1500);

    return (
      <div className="p-6 text-center flex items-center justify-center w-full h-screen text-sm md:text-base text-red-500">
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
    <div className="min-h-screen flex flex-col px-4 md:px-6 pt-20 md:pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="py-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900">
            {t("play.title")}
          </h1>

          <p className="text-3xl font-serif text-primary">
            {quiz.creator_name}?
          </p>
        </div>

        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center py-8">
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
            <div className="bg-white rounded-3xl shadow-lg p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 text-center">
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
                      className={`
                        w-full p-4 md:p-5 rounded-2xl border-2 transition-all
                        flex items-center justify-between gap-3 min-h-11
                        ${optionStyles[state]}
                        ${
                          isDisabled
                            ? "cursor-default"
                            : "cursor-pointer hover:shadow-md"
                        }
                      `}
                    >
                      <span className="font-medium text-base md:text-lg flex-1 text-left">
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
                          <Check className="w-6 h-6 md:flex hidden" />
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
                          <X className="w-6 h-6 md:flex hidden" />
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
                      className={`
                       p-4 md:p-8 rounded-2xl border-2 transition-all
                        flex flex-col items-center justify-center gap-3 min-h-22
                        ${optionStyles[state]}
                        ${
                          isDisabled
                            ? "cursor-default"
                            : "cursor-pointer hover:shadow-lg"
                        }
                      `}
                    >
                      <span className="font-semibold text-xl md:text-2xl">
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
                          className="md:flex hidden"
                        >
                          <Check className="w-7 h-7 " />
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
                          className="md:flex hidden"
                        >
                          <X className="w-7 h-7" />
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
            className={`text-base md:text-lg font-medium ${
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
