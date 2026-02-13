import { QuestionType, Quiz } from "@/types/types";

export function uiTypeToQuestionType(
  type: "multiple-choice" | "yes-no",
): QuestionType {
  return type === "yes-no" ? "yesno" : "multiple";
}

export function questionTypeToUiType(
  type: QuestionType,
): "multiple-choice" | "yes-no" {
  return type === "yesno" ? "yes-no" : "multiple-choice";
}

/**
 * Robust clipboard utility that works across all browsers and contexts
 * Provides fallback when Clipboard API is blocked
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Clipboard API blocked, fall through to fallback
      console.warn("Clipboard API blocked, using fallback method");
    }
  }

  // Fallback: create temporary textarea
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Make it invisible and non-interactive
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    // Try to copy using execCommand
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    return successful;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

/**
 * Copy text with user feedback
 */
export async function copyWithFeedback(
  text: string,
  onSuccess?: () => void,
  onError?: () => void,
): Promise<void> {
  const success = await copyToClipboard(text);

  if (success) {
    onSuccess?.();
  } else {
    onError?.();
  }
}

export function calculateDashboardStats(
  timeframe: "7d" | "30d" | "all" = "all",
) {
  try {
    const keys = Object.keys(localStorage);
    const quizzes: Quiz[] = [];

    for (const key of keys) {
      if (key.startsWith("quiz-")) {
        const quiz = JSON.parse(localStorage.getItem(key) || "{}") as Quiz;
        quizzes.push(quiz);
      }
    }

    // Filter by timeframe
    const now = new Date();
    const filteredQuizzes = quizzes.filter((quiz) => {
      const createdDate = new Date(quiz.created_at);
      const daysDiff = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (timeframe === "7d") return daysDiff <= 7;
      if (timeframe === "30d") return daysDiff <= 30;
      return true; // 'all'
    });

    // Calculate stats
    const totalQuizzes = filteredQuizzes.length;
    const totalQuestions = filteredQuizzes.reduce(
      (sum, q) => sum + q.questions.length,
      0,
    );
    const completedQuizzes = filteredQuizzes.filter(
      (q) => q.partner_completed,
    ).length;

    const scores = filteredQuizzes
      .filter((q) => q.partner_completed)
      .map((q) => q.partner_score);
    const averageScore =
      scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        : 0;

    // Score distribution
    const distribution = {
      strangers: scores.filter((s) => s < 40).length,
      developing: scores.filter((s) => s >= 40 && s < 60).length,
      inSync: scores.filter((s) => s >= 60 && s < 75).length,
      deepConnection: scores.filter((s) => s >= 75 && s < 90).length,
      soulmates: scores.filter((s) => s >= 90).length,
    };

    const scoreDistribution = [
      { label: "Strangers", count: distribution.strangers, range: "0-40%" },
      { label: "Developing", count: distribution.developing, range: "40-60%" },
      { label: "In Sync", count: distribution.inSync, range: "60-75%" },
      {
        label: "Deep Connection",
        count: distribution.deepConnection,
        range: "75-90%",
      },
      { label: "Soulmates", count: distribution.soulmates, range: "90-100%" },
    ];

    // Recent quizzes
    const recentQuizzes = [...filteredQuizzes]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10)
      .map((q) => ({
        id: q.id,
        creatorName: q.creator_name,
        partnerName: q.partner_name,
        questionCount: q.questions.length,
        status: q.partner_completed
          ? ("completed" as const)
          : ("pending" as const),
        score: q.partner_score || 0,
        createdAt: new Date(q.created_at),
      }));

    // Growth data (last 7 or 30 days)
    const daysToShow = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 30;
    const growthData = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (daysToShow - 1 - i));
      const dateStr = date.toISOString().split("T")[0];

      const count = filteredQuizzes.filter((q) => {
        const qDate = new Date(q.created_at).toISOString().split("T")[0];
        return qDate === dateStr;
      }).length;

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      };
    });

    return {
      totalQuizzes,
      totalQuestions,
      completedQuizzes,
      averageScore,
      scoreDistribution,
      recentQuizzes,
      growthData,
    };
  } catch {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      completedQuizzes: 0,
      averageScore: 0,
      scoreDistribution: [],
      recentQuizzes: [],
      growthData: [],
    };
  }
}
