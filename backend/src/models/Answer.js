const { supabase } = require("../config/db");

const addAnswer = async ({
  quizId,
  playerType,
  questionId,
  selectedOptionIndex,
}) => {
  // Vérifier si l'utilisateur a déjà répondu à cette question
  const { data: existing, error: checkError } = await supabase
    .from("answers")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("player_type", playerType)
    .eq("question_id", questionId)
    .single();

  if (checkError && !checkError.message.includes("No rows")) {
    throw new Error(checkError.message);
  }

  if (existing) {
    throw new Error("Player has already answered this question");
  }

  // Ajouter la réponse
  const { data, error } = await supabase
    .from("answers")
    .insert([
      {
        quiz_id: quizId,
        player_type: playerType,
        question_id: questionId,
        selected_option_index: selectedOptionIndex,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Récupérer toutes les réponses pour un quiz (optionnel pour score)
const getAnswersByQuizId = async (quizId) => {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("quiz_id", quizId);

  if (new Date(data.expires_at) < new Date()) {
    return res.status(410).json({
      success: false,
      message: "This quiz has expired 💔",
    });
  }

  if (error) throw new Error(error.message);

  return data;
};

module.exports = { addAnswer, getAnswersByQuizId };
