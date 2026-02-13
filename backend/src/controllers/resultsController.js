const { supabase } = require("../config/db");

const handleError = (err, res, isDev = false) => {
  console.error("[ERROR]", err.message);

  if (isDev) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal server error" });
};

const getResultsController = async (req, res) => {
  try {
    const { quizId } = req.params;

    const { data: quiz, error } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        language,
        creator_name,
        partner_name,
        question_count,
        partner_score,
        creator_score,
        partner_completed,
        partner_completed_at,
        creator_completed,
        creator_completed_at,
        created_at,
        questions:quiz_questions (
          id,
          question_text,
          correct_answer_index
        ),
        answers (
          question_id,
          selected_option_index,
          player_type
        )
      `,
      )
      .eq("id", quizId)
      .single();

    if (error || !quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    handleError(err, res, process.env.NODE_ENV !== "production");
  }
};

module.exports = { getResultsController };
