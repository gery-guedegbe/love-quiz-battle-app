"use client";

import { useQuizStore } from "@/store/quizStore";
import { useEffect, useState } from "react";
import { createQuiz, getRandomQuestions } from "@/lib/api";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { QuestionEditorCard } from "@/components/QuestionEditorCard";
import { CustomQuestionPlaceholder } from "@/components/CustomQuestionPlaceholder";
import { Question, QuestionType } from "@/types/types";
import { ProgressBar } from "@/components/ProgressBar";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const { t } = useLanguage();
  const quizStore = useQuizStore();

  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [predefinedPool, setPredefinedPool] = useState<Question[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const predefinedCount = quizStore.questionCount;
  const partnerName = quizStore.partnerName;
  const customCount = 3;
  const totalCount = predefinedCount + customCount;

  function normalizeQuestionType(type: string): QuestionType {
    return type === "yes-no" || type === "yesno" ? "yesno" : "multiple";
  }

  // ------------------- Load Questions -------------------
  useEffect(() => {
    async function fetchQuestions() {
      if (!quizStore.language) return;

      const predefined = await getRandomQuestions(
        quizStore.language,
        quizStore.questionCount,
      );

      const normalizedPredefined = predefined
        .slice(0, quizStore.questionCount)
        .map((q) => ({
          ...q,
          type: normalizeQuestionType(q.type),
          is_custom: false,
          correct_answer_index: q.correct_answer_index ?? 0,
          options: q.options.map((opt, idx) =>
            typeof opt === "string"
              ? { text: opt, index: idx }
              : { ...opt, index: idx },
          ),
        }));

      setPredefinedPool(normalizedPredefined);

      const initialQuestions: Question[] = [
        ...normalizedPredefined,
        ...Array.from({ length: customCount }, (_, i) => ({
          id: `custom-${i}`,
          question_text: "",
          type: "multiple" as QuestionType,
          options: Array.from({ length: 4 }, (_, idx) => ({
            text: "",
            index: idx,
          })),
          correct_answer_index: 0,
          is_custom: true,
          is_active: false,
        })),
      ];

      setQuestions(initialQuestions);
    }

    fetchQuestions();
  }, [quizStore.language, quizStore.questionCount]);

  const currentQuestion = questions[currentIndex];
  const isInSpiceSection = currentIndex >= predefinedCount;
  const isCustomAndEmpty =
    currentQuestion?.is_custom && currentQuestion?.is_active !== true;

  // ------------------- Update Question -------------------
  const updateQuestion = (updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[currentIndex] = { ...currentQuestion, ...updates };
    setQuestions(newQuestions);
    setErrors({});
  };

  // ------------------- Shuffle Question -------------------
  const handleShuffle = () => {
    if (!currentQuestion?.id || currentQuestion.is_custom) return;

    const alternatives = predefinedPool.filter(
      (q) => q.id !== currentQuestion.id,
    );

    if (alternatives.length === 0) return;

    const randomIndex = Math.floor(Math.random() * alternatives.length);
    const alternative = alternatives[randomIndex];

    updateQuestion({
      id: alternative.id,
      question_text: alternative.question_text,
      type: alternative.type,
      options: alternative.options,
      correct_answer_index: alternative.correct_answer_index ?? 0,
    });
  };

  // ------------------- Validation -------------------
  const validateQuestion = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentQuestion.question_text.trim()) newErrors.question = "Required";

    const hasEmptyOptions = currentQuestion.options.some(
      (opt) => !opt.text.trim(),
    );
    if (hasEmptyOptions) newErrors.options = "Fill all options";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------- Navigation -------------------
  const handleNext = async () => {
    if (!isCustomAndEmpty && !validateQuestion()) return;

    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const validQuestions = questions.filter(
        (q) => !q.is_custom || (q.is_custom && q.question_text.trim()),
      );

      const createdQuiz = await createQuiz({
        language: quizStore.language,
        creatorName: quizStore.creatorName,
        partnerName: quizStore.partnerName,
        questionCount: quizStore.questionCount,
        questions: validQuestions,
      });

      router.push(`/quiz/${createdQuiz.quizId}`);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-1.5">
        <Sparkles className="text-primary h-8 w-8 animate-spin" />
        <p className="text-gray-600">{t("global.loading")}</p>
      </div>
    );
  }

  // ------------------- Render -------------------
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-14">
      {/* Header */}
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-0"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>

          <h1 className="text-base font-semibold text-gray-900 md:text-lg">
            {t("creation.headerTitle")} {partnerName}
          </h1>

          <div className="w-11" />
        </div>

        <ProgressBar current={currentIndex + 1} total={totalCount} />
      </div>

      {/* Spice Section */}
      {currentIndex === predefinedCount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-8"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="via-primary h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
            <Sparkles className="text-primary h-5 w-5" />
            <div className="from-primary via-primary h-px flex-1 bg-linear-to-r to-transparent" />
          </div>

          <h2 className="text-primary mb-2 text-center font-serif text-2xl">
            {t("creation.spiceTitle")}
          </h2>

          <p className="text-center text-sm text-gray-600">
            {t("creation.spiceSubtitle").replace(
              "{count}",
              String(customCount),
            )}
          </p>
        </motion.div>
      )}

      {/* Question Editor */}
      <div className="flex flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isCustomAndEmpty ? (
              <CustomQuestionPlaceholder
                index={currentIndex - predefinedCount}
                onClick={() =>
                  updateQuestion({
                    is_active: true,
                  })
                }
              />
            ) : (
              <QuestionEditorCard
                question={currentQuestion}
                onUpdate={updateQuestion}
                onShuffle={handleShuffle}
                showShuffle={!currentQuestion.is_custom}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-[#FF8B94] bg-[#FF8B94]/10 p-4"
          >
            <p className="text-center text-sm text-[#FF8B94]">
              {errors.question
                ? t("creation.errorQuestion")
                : t("creation.errorOptions")}
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="space-y-2 py-6">
        <Button onClick={handleNext} fullWidth>
          {currentIndex === totalCount - 1 ? (
            <>
              <Check className="h-5 w-5" />
              {isInSpiceSection
                ? t("creation.finishButton")
                : t("creation.startPlayingButton")}
            </>
          ) : (
            <>
              {isCustomAndEmpty
                ? t("creation.skipButton")
                : t("creation.nextButton")}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>

        {isInSpiceSection && isCustomAndEmpty && (
          <p className="mt-4 text-center text-xs text-gray-500 md:mt-6">
            {t("creation.skipNote")}
          </p>
        )}
      </div>
    </div>
  );
}
