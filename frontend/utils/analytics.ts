import { Quiz } from "@/types/types";

export interface RecentQuizFormatted {
  id: string;
  creatorName: string;
  partnerName: string;
  questionCount: number;
  status: "completed" | "pending";
  score: number;
  createdAt: Date;
}

export interface ScoreDistribution {
  label: string;
  count: number;
  range: string;
}

export interface GrowthDataPoint {
  date: string;
  count: number;
}

/**
 * Formate les quizzes pour le tableau récent
 */
export function formatRecentQuizzes(quizzes: Quiz[]): RecentQuizFormatted[] {
  return quizzes
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 10)
    .map((quiz) => ({
      id: quiz.id,
      creatorName: quiz.creator_name,
      partnerName: quiz.partner_name,
      questionCount: quiz.question_count,
      status: quiz.partner_completed ? "completed" : "pending",
      score: quiz.partner_score || 0,
      createdAt: new Date(quiz.created_at),
    }));
}

/**
 * Génère la distribution des scores à partir des vrais quizzes
 */
export function generateScoreDistribution(
  quizzes: Quiz[],
): ScoreDistribution[] {
  const completedQuizzes = quizzes.filter(
    (q) => q.partner_completed && q.partner_score,
  );

  const brackets = [
    { label: "0-39%", range: "0-39%", min: 0, max: 39 },
    { label: "40-59%", range: "40-59%", min: 40, max: 59 },
    { label: "60-74%", range: "60-74%", min: 60, max: 74 },
    { label: "75-89%", range: "75-89%", min: 75, max: 89 },
    { label: "90-100%", range: "90-100%", min: 90, max: 100 },
  ];

  return brackets.map((bracket) => ({
    ...bracket,
    count: completedQuizzes.filter(
      (q) => q.partner_score >= bracket.min && q.partner_score <= bracket.max,
    ).length,
  }));
}

/**
 * Génère les données de croissance à partir des vrais quizzes
 */
export function generateGrowthData(
  quizzes: Quiz[],
  timeframe: "7d" | "30d" | "all",
): GrowthDataPoint[] {
  const now = new Date();
  let days = 30;

  if (timeframe === "7d") days = 7;
  if (timeframe === "30d") days = 30;
  if (timeframe === "all") days = 30;

  const data: GrowthDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = quizzes.filter((quiz) => {
      const createdAt = new Date(quiz.created_at);
      return createdAt >= date && createdAt < nextDate;
    }).length;

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count,
    });
  }

  return data;
}
