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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t("quizReady.loading")}</p>
      </div>
    );
  }

  // ---------------- Error ----------------
  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t("quizReady.notFound")}</p>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-4 md:space-y-8 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-18 md:w-24 h-18 md:h-24 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-8 md:w-12 h-8 md:h-12 text-white" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl lg:text-5xl font-serif text-gray-900">
            {t("quizReady.titlePart1")}
            <br />
            <span className="text-primary">{t("quizReady.titlePart2")}</span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-sm">
            {t("quizReady.subtitle", { partnerName: quiz.partner_name })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-white rounded-3xl shadow-lg p-4 md:p-6 space-y-4"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="space-y-1 md:space-y-2">
              <p className="text-sm text-gray-500">{t("quizReady.quizBy")}</p>

              <p className="text-lg font-semibold text-gray-900">
                {quiz.creator_name}
              </p>
            </div>

            <div className="text-right space-y-1 md:space-y-2">
              <p className="text-sm text-gray-500">
                {t("quizReady.questions")}
              </p>

              <p className="text-2xl font-serif text-primary">
                {quiz.questions.length}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              {t("quizReady.shareableLink")}
            </label>

            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 truncate font-mono">
                {shareUrl}
              </div>

              <button
                onClick={handleCopyLink}
                aria-label={copied ? t("quizReady.copySuccess") : "Copy link"}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                {copied ? (
                  <Check className="w-4 md:w-5 h-4 md:h-5 text-success" />
                ) : (
                  <Copy className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
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
          <ExternalLink className="w-4 md:w-5 h-4 md:h-5" />
          {t("quizReady.shareButton", { partnerName: quiz.partner_name })}
        </Button>

        <Button onClick={handleDashboard} variant="secondary" fullWidth>
          <BarChart3 className="w-4 md:w-5 h-4 md:h-5" />
          {t("quizReady.dashboardButton")}
        </Button>
      </motion.div>
    </div>
  );
}
