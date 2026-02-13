const { supabase } = require("../config/db");

const verifyQuizAccess = async (req, res, next) => {
  try {
    const quizId = req.params.quizId || req.params.id || req.body?.quizId;

    if (!quizId) {
      return res.status(400).json({ error: "Quiz ID required" });
    }

    const { data: quiz, error } = await supabase
      .from("quizzes")
      .select("id, creator_name, partner_name")
      .eq("id", quizId)
      .single();

    if (error || !quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Store quiz info in request for use in controller
    req.quiz = quiz;
    next();
  } catch (error) {
    console.error("[VERIFY_ACCESS]", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verifyQuizAccess;
