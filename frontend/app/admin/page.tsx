"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  RefreshCw,
  FileText,
  Target,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useQuizStore } from "@/store/quizStore";
import {
  fetchAnalytics,
  generateAnalyticsSnapshot,
  fetchAnalyticsSnapshots,
  fetchAllQuizzes,
} from "@/lib/api";
import { GlobalStats, AnalyticsSnapshot, Quiz } from "@/types/types";
import {
  formatRecentQuizzes,
  generateScoreDistribution,
  generateGrowthData,
  RecentQuizFormatted,
} from "@/utils/analytics";

import { KPICard } from "@/components/dashboard/KPICard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { ScoreDistributionChart } from "@/components/dashboard/ScoreDistributionChart";
import { RecentQuizzesTable } from "@/components/dashboard/RecentQuizzesTable";
import { SnapshotsList } from "@/components/dashboard/SnapshotsList";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { role } = useQuizStore();

  // États
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuizFormatted[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "all">("30d");

  // Données calculées à partir des vrais quizzes
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<any[]>([]);

  // ============================================
  // CHARGEMENT DES DONNÉES
  // ============================================
  useEffect(() => {
    loadDashboardData();
  }, []);

  // ============================================
  // RECALCUL DES GRAPHIQUES QUAND LES DONNÉES CHANGENT
  // ============================================
  useEffect(() => {
    if (allQuizzes.length > 0) {
      setGrowthData(generateGrowthData(allQuizzes, timeframe));
      setScoreDistribution(generateScoreDistribution(allQuizzes));
      setRecentQuizzes(formatRecentQuizzes(allQuizzes));
    }
  }, [allQuizzes, timeframe]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Récupérer les stats globales
      const statsData = await fetchAnalytics();
      setStats(statsData);

      // 2. Récupérer tous les quizzes
      const quizzes = await fetchAllQuizzes();
      setAllQuizzes(quizzes);

      // 3. Récupérer tous les snapshots
      const snapshotsData = await fetchAnalyticsSnapshots();
      setSnapshots(snapshotsData);
    } catch (err: any) {
      console.error("Failed to load admin data:", err);
      setError(t("admin.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ACTIONS
  // ============================================
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const statsData = await fetchAnalytics();
      setStats(statsData);

      // Recharger aussi les quizzes pour les graphiques
      const quizzes = await fetchAllQuizzes();
      setAllQuizzes(quizzes);
    } catch (err: any) {
      console.error("Failed to refresh stats:", err);
      setError(t("admin.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSnapshot = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const newSnapshot = await generateAnalyticsSnapshot();
      setSnapshots([newSnapshot, ...snapshots]);
    } catch (err: any) {
      console.error("Failed to generate snapshot:", err);
      setError(t("admin.errors.generateFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewQuiz = (quizId: string) => {
    router.push(`/result/${quizId}`);
  };

  // ============================================
  // RENDU
  // ============================================
  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RefreshCw className="text-primary h-8 w-8 animate-spin" />
        <p className="ml-2 text-gray-600">{t("global.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-md">
                <Heart className="h-6 w-6 fill-white text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {t("admin.title")}
                </h1>
                <p className="text-xs text-gray-600 sm:text-sm">
                  {t("admin.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateSnapshot}
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {isGenerating
                  ? t("admin.snapshots.generating")
                  : t("admin.snapshots.generate")}
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? t("admin.refreshing") : t("admin.recalculate")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {/* KPI Cards - Vraies données */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <KPICard
            title={t("admin.kpi.totalQuizzes")}
            value={stats?.totalQuizzes ?? 0}
            icon={FileText}
            color="pink"
          />
          <KPICard
            title={t("admin.kpi.questionsGenerated")}
            value={stats?.totalQuestionsGenerated ?? 0}
            icon={Target}
            color="purple"
          />
          <KPICard
            title={t("admin.kpi.completedQuizzes")}
            value={stats?.totalCompletedQuizzes ?? 0}
            icon={CheckCircle}
            color="coral"
          />
          <KPICard
            title={t("admin.kpi.avgScore")}
            value={`${stats?.averageScore ?? 0}%`}
            icon={TrendingUp}
            color="blue"
          />
        </div>

        {/* Charts Section - Vraies données */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Growth Chart - Basé sur les vrais quizzes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-lg font-bold text-gray-900">
                {t("admin.charts.growth")}
              </h2>
              <div className="flex items-center gap-1 self-start rounded-lg bg-gray-100 p-1 sm:self-auto">
                {(["7d", "30d", "all"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      timeframe === tf
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tf === "7d" && t("admin.charts.7days")}
                    {tf === "30d" && t("admin.charts.30days")}
                    {tf === "all" && t("admin.charts.allTime")}
                  </button>
                ))}
              </div>
            </div>
            <GrowthChart data={growthData} />
          </div>

          {/* Score Distribution - Basé sur les vrais quizzes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {t("admin.charts.distribution")}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("admin.charts.distributionSubtitle")}
              </p>
            </div>
            <ScoreDistributionChart data={scoreDistribution} />
          </div>
        </div>

        {/* Snapshots History - Vraies données */}
        {snapshots.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {t("admin.snapshots.title")}
              </h2>
            </div>
            <SnapshotsList snapshots={snapshots} />
          </div>
        )}

        {/* Recent Quizzes Table - Vrais quizzes */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {t("admin.recent.title")}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t("admin.recent.subtitle", { count: recentQuizzes.length })}
            </p>
          </div>
          <RecentQuizzesTable
            quizzes={recentQuizzes}
            onViewDetails={handleViewQuiz}
          />
        </div>
      </div>
    </div>
  );
}
