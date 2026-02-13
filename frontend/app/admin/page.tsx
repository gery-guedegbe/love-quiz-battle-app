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
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-600 ml-2">{t("global.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {t("admin.title")}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t("admin.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateSnapshot}
                disabled={isGenerating}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {isGenerating
                  ? t("admin.snapshots.generating")
                  : t("admin.snapshots.generate")}
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? t("admin.refreshing") : t("admin.recalculate")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI Cards - Vraies données */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart - Basé sur les vrais quizzes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {t("admin.charts.growth")}
              </h2>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
                {(["7d", "30d", "all"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
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
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {t("admin.charts.distribution")}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t("admin.charts.distributionSubtitle")}
              </p>
            </div>
            <ScoreDistributionChart data={scoreDistribution} />
          </div>
        </div>

        {/* Snapshots History - Vraies données */}
        {snapshots.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
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
            <p className="text-sm text-gray-600 mt-1">
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
