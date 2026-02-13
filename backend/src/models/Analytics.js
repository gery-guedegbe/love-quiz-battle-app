const { supabase } = require("../config/db");

const calculateGlobalStats = async () => {
  // Total quizzes
  const { count: totalQuizzes } = await supabase
    .from("quizzes")
    .select("*", { count: "exact", head: true });

  // Total questions generated
  const { count: totalQuestions } = await supabase
    .from("quiz_questions")
    .select("*", { count: "exact", head: true });

  // Completed quizzes
  const { data: completedQuizzes } = await supabase
    .from("quizzes")
    .select("partner_score")
    .eq("partner_completed", true);

  const totalCompleted = completedQuizzes.length;

  const averageScore =
    totalCompleted === 0
      ? 0
      : completedQuizzes.reduce((acc, q) => acc + (q.partner_score || 0), 0) /
        totalCompleted;

  return {
    totalQuizzes,
    totalQuestionsGenerated: totalQuestions,
    totalCompletedQuizzes: totalCompleted,
    averageScore: Math.round(averageScore),
  };
};

const saveSnapshot = async (stats) => {
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .insert([stats])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { calculateGlobalStats, saveSnapshot };
