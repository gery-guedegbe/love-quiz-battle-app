"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { BarChart3, Check, Copy, ExternalLink } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { copyToClipboard } from "@/utils/utils";
import { useQuizStore } from "@/store/quizStore";
import { useLanguage } from "@/context/LanguageContext";
import { Quiz } from "@/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function QuizReadyPage() {
  const { t } = useLanguage();
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const { role } = useQuizStore();

  const [quiz, setQuiz] = useState<Quiz>();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Role protection
  useEffect(() => {
    if (role && role !== "creator") {
      router.replace("/");
    }
  }, [role, router]);

  // Fetch quiz
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`${API_URL}/quizzes/${quizId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        console.log(data);

        setQuiz(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (quizId) fetchQuiz();
  }, [quizId]);

  console.log("Quiz Data : ", quiz);

  // Safe share URL (SSR safe)
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/play/${quizId}`;
  }, [quizId]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!quiz) return;

    const shareData = {
      title: `${quiz.creator_name}'s Love Quiz`,
      text: t("quizReady.shareText", { partnerName: quiz.partner_name }),
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDashboard = () => {
    router.push(`/quiz/${quizId}/creator-dashboard`);
  };

  // ---------------- Loading ----------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">{t("quizReady.loading")}</p>
      </div>
    );
  }

  // ---------------- Error ----------------
  if (error || !quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">{t("quizReady.notFound")}</p>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-between p-4 md:p-6">
      <div className="flex w-full flex-1 flex-col items-center justify-center space-y-4 py-12 md:space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="from-primary to-primary-light flex h-18 w-18 items-center justify-center rounded-full bg-linear-to-br shadow-lg md:h-24 md:w-24">
              <Check className="h-8 w-8 text-white md:h-12 md:w-12" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 text-center"
        >
          <h1 className="font-serif text-4xl text-gray-900 lg:text-5xl">
            {t("quizReady.titlePart1")}
            <br />
            <span className="text-primary">{t("quizReady.titlePart2")}</span>
          </h1>

          <p className="max-w-sm text-base text-gray-600 md:text-lg">
            {t("quizReady.subtitle", { partnerName: quiz.partner_name })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-4 rounded-3xl bg-white p-4 shadow-lg md:p-6"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1 md:space-y-2">
              <p className="text-sm text-gray-500">{t("quizReady.quizBy")}</p>

              <p className="text-lg font-semibold text-gray-900">
                {quiz.creator_name}
              </p>
            </div>

            <div className="space-y-1 text-right md:space-y-2">
              <p className="text-sm text-gray-500">
                {t("quizReady.questions")}
              </p>

              <p className="text-primary font-serif text-2xl">
                {quiz.questions.length}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-500">
              {t("quizReady.shareableLink")}
            </label>

            <div className="flex gap-2">
              <div className="flex-1 truncate rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-600">
                {shareUrl}
              </div>

              <button
                onClick={handleCopyLink}
                aria-label={copied ? t("quizReady.copySuccess") : "Copy link"}
                className="flex items-center justify-center rounded-xl bg-gray-100 p-3 transition-colors hover:bg-gray-200"
              >
                {copied ? (
                  <Check className="text-success h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600 md:h-5 md:w-5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="w-full space-y-3 pb-6"
      >
        <Button onClick={handleShare} fullWidth>
          <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
          {t("quizReady.shareButton", { partnerName: quiz.partner_name })}
        </Button>

        <Button onClick={handleDashboard} variant="secondary" fullWidth>
          <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
          {t("quizReady.dashboardButton")}
        </Button>
      </motion.div>
    </div>
  );
}
