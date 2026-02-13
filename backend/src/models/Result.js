const { supabase } = require("../config/db");

// Récupérer toutes les réponses pour un quiz
const getAnswersByQuizId = async (quizId) => {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("quiz_id", quizId);

  if (error) throw new Error(error.message);
  return data;
};

// Récupérer les questions pour calcul
const getQuestionsByQuizId = async (quizId) => {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quizId);

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { getAnswersByQuizId, getQuestionsByQuizId };
