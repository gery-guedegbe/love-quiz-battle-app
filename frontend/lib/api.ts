import {
  AnalyticsSnapshot,
  AnswerPayload,
  GlobalStats,
  Question,
  Quiz,
} from "./../types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fonction générique
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

// Récupérer des questions aléatoires
export async function getRandomQuestions(language: "fr" | "en", count: number) {
  return fetchAPI<Question[]>(
    `/questions?language=${language}&count=${count + 20}`,
  );
}

// Créer un quiz complet avec questions
export async function createQuiz(payload: {
  language: "fr" | "en";
  creatorName: string;
  partnerName: string;
  questionCount: number;
  questions: Question[];
}) {
  return fetchAPI<{ quizId: string }>("/quizzes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Récupérer un quiz par ID
export async function fetchQuiz(quizId: string): Promise<Quiz> {
  return fetchAPI(`/quizzes/${quizId}`);
}

export async function submitAnswer(payload: AnswerPayload) {
  return fetchAPI("/answers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${payload.token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchResults(quizId: string): Promise<Quiz> {
  return fetchAPI(`/results/${quizId}`);
}

/**
 * Récupérer les statistiques globales en temps réel
 * GET /api/analytics
 */
export async function fetchAnalytics(): Promise<GlobalStats> {
  return fetchAPI<GlobalStats>("/analytics", {
    headers: {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "",
    },
  });
}

/**
 * Générer et sauvegarder un snapshot des statistiques
 * POST /api/analytics/snapshot
 */
export async function generateAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  return fetchAPI<AnalyticsSnapshot>("/analytics/snapshot", {
    method: "POST",
    headers: {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "",
    },
  });
}

/**
 * Récupérer tous les snapshots d'analytics
 * GET /api/analytics/snapshots
 */
export async function fetchAnalyticsSnapshots(): Promise<AnalyticsSnapshot[]> {
  return fetchAPI<AnalyticsSnapshot[]>("/analytics/snapshots", {
    headers: {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "",
    },
  });
}

/**
 * Récupérer tous les quizzes (admin only)
 * GET /api/quizzes/admin/all
 */
export async function fetchAllQuizzes(): Promise<Quiz[]> {
  return fetchAPI<Quiz[]>("/analytics/admin/all", {
    headers: {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "",
    },
  });
}
