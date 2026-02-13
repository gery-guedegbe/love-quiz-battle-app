import { create } from "zustand";
import { GlobalStats, AnalyticsSnapshot, Quiz } from "@/types/types";

interface AdminState {
  // Données
  stats: GlobalStats | null;
  snapshots: AnalyticsSnapshot[];
  recentQuizzes: Quiz[];
  loading: boolean;
  error: string | null;
  isGenerating: boolean;

  // Actions
  setStats: (stats: GlobalStats | null) => void;
  setSnapshots: (snapshots: AnalyticsSnapshot[]) => void;
  setRecentQuizzes: (quizzes: Quiz[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  reset: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // État initial
  stats: null,
  snapshots: [],
  recentQuizzes: [],
  loading: false,
  error: null,
  isGenerating: false,

  // Actions
  setStats: (stats) => set({ stats }),
  setSnapshots: (snapshots) => set({ snapshots }),
  setRecentQuizzes: (recentQuizzes) => set({ recentQuizzes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  reset: () =>
    set({
      stats: null,
      snapshots: [],
      recentQuizzes: [],
      loading: false,
      error: null,
      isGenerating: false,
    }),
}));
