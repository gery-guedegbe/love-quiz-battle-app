const { supabase } = require("../config/db");
const { addAnswer, getAnswersByQuizId } = require("../models/Answer");

const submitAnswer = async ({
  quizId,
  playerType,
  questionId,
  selectedOptionIndex,
}) => {
  // Ajouter la réponse
  const answer = await addAnswer({
    quizId,
    playerType,
    questionId,
    selectedOptionIndex,
  });

  // Si c'est le partenaire, vérifier s'il a fini
  if (playerType === "partner") {
    // Nombre total de questions du quiz
    const { count: totalQuestionsCount, error: qError } = await supabase
      .from("quiz_questions")
      .select("*", { count: "exact", head: true })
      .eq("quiz_id", quizId);

    if (qError) throw new Error(qError.message);

    // Nombre de réponses du partenaire
    const { count: partnerAnswersCount, error: aError } = await supabase
      .from("answers")
      .select("*", { count: "exact", head: true })
      .eq("quiz_id", quizId)
      .eq("player_type", "partner");

    if (aError) throw new Error(aError.message);

    if (partnerAnswersCount === totalQuestionsCount) {
      await supabase
        .from("quizzes")
        .update({
          partner_completed: true,
          partner_completed_at: new Date().toISOString(),
        })
        .eq("id", quizId);
    }
  }

  // Retourner la réponse
  return answer;
};

const fetchAnswers = async (quizId) => {
  return await getAnswersByQuizId(quizId);
};

module.exports = { submitAnswer, fetchAnswers };
