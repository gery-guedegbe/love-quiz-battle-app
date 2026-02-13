const { supabase } = require("../config/db");
const { addAnswer } = require("../models/Answer");
const { submitAnswer } = require("../services/answersService");

const handleError = (err, res, isDev = false) => {
  console.error("[ERROR]", err.message);

  if (err.message === "Invalid payload") {
    return res.status(400).json({ error: "Invalid payload" });
  }
  if (err.message === "Quiz already completed") {
    return res.status(400).json({ error: "Quiz already completed" });
  }

  // Return generic error in production
  if (isDev) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal server error" });
};

/**
 * POST /api/answers
 * Body:
 *  - quizId
 *  - playerType: creator | partner
 *  - batch: array[{ questionId, selectedOptionIndex }]
 */
const submitAnswerController = async (req, res) => {
  try {
    const { quizId, playerType, batch } = req.body;

    if (!quizId || !playerType || !batch?.length) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Vérifier si déjà complété
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("partner_completed")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.partner_completed) {
      return res.status(400).json({ error: "Quiz already completed" });
    }

    // INSERT BULK (pas de boucle)
    const answersToInsert = batch.map((ans) => ({
      quiz_id: quizId,
      player_type: playerType,
      question_id: ans.questionId,
      selected_option_index: ans.selectedOptionIndex,
    }));

    const { error: insertError } = await supabase
      .from("answers")
      .insert(answersToInsert);

    if (insertError) throw insertError;

    // Récupérer questions
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("id, correct_answer_index")
      .eq("quiz_id", quizId);

    if (questionsError) throw questionsError;

    let correctCount = 0;

    for (const q of questions) {
      const answer = batch.find((a) => a.questionId === q.id);

      if (answer && answer.selectedOptionIndex === q.correct_answer_index) {
        correctCount++;
      }
    }

    const percentage = Math.round((correctCount / questions.length) * 100);

    // Mise à jour finale unique
    const { error: updateError } = await supabase
      .from("quizzes")
      .update({
        partner_completed: true,
        partner_completed_at: new Date().toISOString(),
        partner_score: percentage,
      })
      .eq("id", quizId);

    if (updateError) throw updateError;

    return res.status(201).json({
      message: "Quiz completed",
      score: percentage,
    });
  } catch (err) {
    handleError(err, res, process.env.NODE_ENV !== "production");
  }
};

module.exports = { submitAnswerController };
