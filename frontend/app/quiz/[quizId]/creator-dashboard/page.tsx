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
      <div className="min-h-screen flex items-center justify-center">
        <Clock className="w-6 md:w-8 h-6 md:h-8 text-primary animate-spin" />
        <p className="text-gray-600 ml-2">{t("global.loading")}</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push("/")}>{t("global.goBack")}</Button>
      </div>
    );

  const isCompleted = !!quiz?.partner_completed;
  const shareUrl = `${window.location.origin}/play/${quiz?.id}`;

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-6 pt-16 md:pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="py-4 space-y-2">
        <div className="flex items-center gap-1.5 md:gap-2 text-[#FF6B6B]">
          <BarChart3 className="w-5 h-5" />
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
          className="bg-white rounded-3xl shadow-lg p-4 md:p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {t("dashboard.createdBy")}
              </p>

              <h2 className="text-2xl font-serif text-gray-900">
                {quiz?.creator_name}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                {t("dashboard.for")}{" "}
                <span className="font-semibold">{quiz?.partner_name}</span>
              </p>
            </div>

            <div className="px-4 py-2 bg-[#FF6B6B]/10 rounded-full">
              <p className="text-2xl font-serif text-[#FF6B6B]">
                {quiz?.questions.length}
              </p>

              <p className="text-xs text-gray-600 text-center">
                {t("dashboard.questions")}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">
                {t("dashboard.multipleChoice")}
              </p>

              <p className="font-semibold text-gray-900">
                {quiz?.questions.filter((q) => q.type === "multiple").length}
              </p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">{t("dashboard.yesNo")}</p>

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
            className="bg-linear-to-br from-[#6BCF7F]/10 to-[#6BCF7F]/5 rounded-3xl shadow-lg p-4 md:p-6 border-2 border-[#6BCF7F]/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#6BCF7F] rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
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
            <div className="bg-white rounded-2xl p-4 md:p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {t("dashboard.finalScore")}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <div
                    className="text-5xl font-serif"
                    style={{ color: getBadge(quiz!.partner_score).color }}
                  >
                    {quiz!.partner_score}%
                  </div>

                  <div className="text-4xl">
                    {getBadge(quiz!.partner_score).emoji}
                  </div>
                </div>
                <p
                  className="text-lg font-semibold mt-2"
                  style={{ color: getBadge(quiz!.partner_score).color }}
                >
                  {getBadge(quiz!.partner_score).title}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="w-4 h-4 text-[#6BCF7F]" />
                  </div>

                  <p className="text-xl font-serif text-[#6BCF7F]">
                    {Math.round(
                      (quiz!.partner_score / 100) * quiz!.questions.length,
                    )}
                  </p>

                  <p className="text-xs text-gray-600">
                    {t("dashboard.correct")}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>

                  <p className="text-xl font-serif text-gray-400">
                    {quiz!.questions.length -
                      Math.round(
                        (quiz!.partner_score / 100) * quiz!.questions.length,
                      )}
                  </p>

                  <p className="text-xs text-gray-600">
                    {t("dashboard.wrong")}
                  </p>
                </div>

                <ViewRecapCTA />

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="w-4 h-4 text-gray-900" />
                  </div>

                  <p className="text-xl font-serif text-gray-900">
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
            className="bg-linear-to-br from-[#FFD700]/10 to-[#FFD700]/5 rounded-3xl shadow-lg p-4 md:p-6 border-2 border-dashed border-[#FFD700]/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center"
              >
                <Clock className="w-6 h-6 text-white" />
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
            <div className="bg-white rounded-2xl p-2 md:p-4">
              <p className="text-xs text-gray-500 mb-2">
                {t("dashboard.shareableLink")}
              </p>

              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-600 truncate font-mono">
                  {shareUrl}
                </div>

                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-[#6BCF7F]" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
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
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-sm text-gray-600 mb-1">
              {t("dashboard.customQuestions")}
            </p>

            <p className="text-2xl font-serif text-[#FF6B6B]">
              {quiz?.questions.filter((q) => q.is_custom).length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-sm text-gray-600 mb-1">
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

      {/* Actions */}
      <div className="space-y-3 pb-6">
        {!isCompleted && (
          <Button onClick={handleCopyLink} variant="secondary" fullWidth>
            <Share2 className="w-5 h-5" />
            {t("dashboard.shareQuizLink")}
          </Button>
        )}

        <Button onClick={onCreateNew} fullWidth>
          <Plus className="w-5 h-5" />
          {t("dashboard.createNewQuiz")}
        </Button>
      </div>
    </div>
  );
}
