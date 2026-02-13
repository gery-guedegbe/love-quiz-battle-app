"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { copyToClipboard } from "@/utils/utils";
import {
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Copy,
  Heart,
  Plus,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchQuiz } from "@/lib/api";
import { Quiz } from "@/types/types";
import ViewRecapCTA from "@/components/ViewRecapCTA";

export default function CreatorDashboardPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { quizId } = useParams<{ quizId: string }>();

  const [quiz, setQuiz] = useState<Quiz>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ------------------- Fetch Quiz -------------------
  useEffect(() => {
    if (!quizId) {
      setError(t("errors.missingQuizId"));
      setLoading(false);
      return;
    }

    const loadQuiz = async () => {
      try {
        setLoading(true);

        const data = await fetchQuiz(quizId);

        // Vérifie que l'utilisateur est bien le créateur
        if (!data || !data.creator_name) {
          setError(t("errors.quizNotFound"));
        } else {
          setQuiz(data);
        }
      } catch (err) {
        console.error(err);
        setError(t("errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, t]);

  const handleCopyLink = async () => {
    if (!quiz) return;
    const shareUrl = `${window.location.origin}/play/${quiz.id}`;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBadge = (score: number) => {
    if (score >= 90)
      return { title: t("badges.soulmates"), color: "#FF6B6B", emoji: "💕" };
    if (score >= 75)
      return { title: t("badges.bestFriends"), color: "#FFD700", emoji: "✨" };
    if (score >= 60)
      return { title: t("badges.gettingThere"), color: "#6BCF7F", emoji: "🌟" };
    if (score >= 40)
      return { title: t("badges.roomToGrow"), color: "#FF8B94", emoji: "🌱" };
    return { title: t("badges.strangerThings"), color: "#9CA3AF", emoji: "👀" };
  };

  const onCreateNew = () => router.push("/create");

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Clock className="text-primary h-6 w-6 animate-spin md:h-8 md:w-8" />
        <p className="ml-2 text-gray-600">{t("global.loading")}</p>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="mb-4 text-red-500">{error}</p>
        <Button onClick={() => router.push("/")}>{t("global.goBack")}</Button>
      </div>
    );

  const isCompleted = !!quiz?.partner_completed;
  const shareUrl = `${window.location.origin}/play/${quiz?.id}`;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pt-16 md:px-6 md:pt-6">
      {/* Header */}
      <div className="space-y-2 py-4">
        <div className="flex items-center gap-1.5 text-[#FF6B6B] md:gap-2">
          <BarChart3 className="h-5 w-5" />
          <h1 className="text-lg font-semibold">{t("dashboard.title")}</h1>
        </div>

        <p className="text-sm text-gray-600">
          {t("dashboard.subtitle", { partnerName: quiz?.partner_name || "" })}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 py-4 md:py-6">
        {/* Quiz Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-3xl bg-white p-4 shadow-lg md:p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {t("dashboard.createdBy")}
              </p>

              <h2 className="font-serif text-2xl text-gray-900">
                {quiz?.creator_name}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {t("dashboard.for")}{" "}
                <span className="font-semibold">{quiz?.partner_name}</span>
              </p>
            </div>

            <div className="rounded-full bg-[#FF6B6B]/10 px-4 py-2">
              <p className="font-serif text-2xl text-[#FF6B6B]">
                {quiz?.questions.length}
              </p>

              <p className="text-center text-xs text-gray-600">
                {t("dashboard.questions")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm">
            <div>
              <p className="mb-1 text-gray-500">
                {t("dashboard.multipleChoice")}
              </p>

              <p className="font-semibold text-gray-900">
                {quiz?.questions.filter((q) => q.type === "multiple").length}
              </p>
            </div>

            <div>
              <p className="mb-1 text-gray-500">{t("dashboard.yesNo")}</p>

              <p className="font-semibold text-gray-900">
                {quiz?.questions.filter((q) => q.type === "yesno").length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Status Card */}
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border-2 border-[#6BCF7F]/20 bg-linear-to-br from-[#6BCF7F]/10 to-[#6BCF7F]/5 p-4 shadow-lg md:p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6BCF7F]">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {t("dashboard.quizCompleted")}
                </h3>

                <p className="text-sm text-gray-600">
                  {new Date(quiz!.partner_completed_at).toLocaleDateString(
                    language === "fr" ? "fr-FR" : "en-US",
                  )}{" "}
                  {t("dashboard.at")}{" "}
                  {new Date(quiz!.partner_completed_at).toLocaleTimeString(
                    language === "fr" ? "fr-FR" : "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
            </div>

            {/* Score Display */}
            <div className="space-y-4 rounded-2xl bg-white p-4 md:p-6">
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">
                  {t("dashboard.finalScore")}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <div
                    className="font-serif text-5xl"
                    style={{ color: getBadge(quiz!.partner_score).color }}
                  >
                    {quiz!.partner_score}%
                  </div>

                  <div className="text-4xl">
                    {getBadge(quiz!.partner_score).emoji}
                  </div>
                </div>
                <p
                  className="mt-2 text-lg font-semibold"
                  style={{ color: getBadge(quiz!.partner_score).color }}
                >
                  {getBadge(quiz!.partner_score).title}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <Award className="h-4 w-4 text-[#6BCF7F]" />
                  </div>

                  <p className="font-serif text-xl text-[#6BCF7F]">
                    {Math.round(
                      (quiz!.partner_score / 100) * quiz!.questions.length,
                    )}
                  </p>

                  <p className="text-xs text-gray-600">
                    {t("dashboard.correct")}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                  </div>

                  <p className="font-serif text-xl text-gray-400">
                    {quiz!.questions.length -
                      Math.round(
                        (quiz!.partner_score / 100) * quiz!.questions.length,
                      )}
                  </p>

                  <p className="text-xs text-gray-600">
                    {t("dashboard.wrong")}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <Heart className="h-4 w-4 text-gray-900" />
                  </div>

                  <p className="font-serif text-xl text-gray-900">
                    {quiz!.questions.length}
                  </p>

                  <p className="text-xs text-gray-600">
                    {t("dashboard.total")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border-2 border-dashed border-[#FFD700]/30 bg-linear-to-br from-[#FFD700]/10 to-[#FFD700]/5 p-4 shadow-lg md:p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]"
              >
                <Clock className="h-6 w-6 text-white" />
              </motion.div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {t("dashboard.waiting", {
                    partnerName: quiz?.partner_name || "",
                  })}
                </h3>

                <p className="text-sm text-gray-600">
                  {t("dashboard.notCompleted")}
                </p>
              </div>
            </div>

            {/* Share Link */}
            <div className="rounded-2xl bg-white p-2 md:p-4">
              <p className="mb-2 text-xs text-gray-500">
                {t("dashboard.shareableLink")}
              </p>

              <div className="flex gap-2">
                <div className="flex-1 truncate rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600">
                  {shareUrl}
                </div>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-[#6BCF7F]" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="mb-1 text-sm text-gray-600">
              {t("dashboard.customQuestions")}
            </p>

            <p className="font-serif text-2xl text-[#FF6B6B]">
              {quiz?.questions.filter((q) => q.is_custom).length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="mb-1 text-sm text-gray-600">
              {t("dashboard.created")}
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {quiz?.created_at
                ? new Date(quiz.created_at).toLocaleDateString(
                    language === "fr" ? "fr-FR" : "en-US",
                  )
                : "-"}
            </p>
          </div>
        </motion.div>
      </div>

      {isCompleted && <ViewRecapCTA />}

      {/* Actions */}
      <div className="space-y-3 pt-6 pb-6">
        {!isCompleted && (
          <Button onClick={handleCopyLink} variant="secondary" fullWidth>
            <Share2 className="h-5 w-5" />
            {t("dashboard.shareQuizLink")}
          </Button>
        )}

        <Button onClick={onCreateNew} fullWidth>
          <Plus className="h-5 w-5" />
          {t("dashboard.createNewQuiz")}
        </Button>
      </div>
    </div>
  );
}
