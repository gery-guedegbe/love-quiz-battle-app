const { supabase } = require("../config/db");
const { nanoid } = require("nanoid");

const createQuiz = async ({
  language,
  creatorName,
  partnerName,
  questionCount,
}) => {
  const { data, error } = await supabase
    .from("quizzes")
    .insert([
      {
        language,
        creator_name: creatorName,
        partner_name: partnerName,
        question_count: questionCount,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getQuizById = async (quizId) => {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const getQuizWithQuestions = async (quizId) => {
  // Récupérer quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();

  if (quizError) throw new Error(quizError.message);
  if (!quiz) throw new Error("Quiz not found");

  if (new Date(quiz.expires_at) < new Date()) {
    return res.status(410).json({
      success: false,
      message: "This quiz has expired 💔",
    });
  }

  // Récupérer questions
  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  if (qError) throw new Error(qError.message);

  return { ...quiz, questions };
};

const duplicateQuiz = async (quizId, newCreatorName, newPartnerName) => {
  // Récupérer quiz existant
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) throw new Error("Quiz not found");

  // Créer nouveau quiz
  const newQuizId = nanoid(12);
  const { data: newQuiz, error: createError } = await supabase
    .from("quizzes")
    .insert([
      {
        id: newQuizId,
        language: quiz.language,
        creator_name: newCreatorName || quiz.creator_name,
        partner_name: newPartnerName || quiz.partner_name,
        question_count: quiz.question_count,
      },
    ])
    .select()
    .single();

  if (createError) throw new Error(createError.message);

  // Récupérer questions existantes
  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  if (qError) throw new Error(qError.message);

  // Copier questions avec nouveau quiz_id
  const newQuestions = questions.map((q) => ({
    quiz_id: newQuizId,
    question_text: q.question_text,
    type: q.type,
    options: q.options,
    correct_answer_index: q.correct_answer_index,
    is_custom: q.is_custom,
    order_index: q.order_index,
  }));

  const { data: insertedQuestions, error: insertError } = await supabase
    .from("quiz_questions")
    .insert(newQuestions);

  if (insertError) throw new Error(insertError.message);

  return newQuiz;
};

const generateShareToken = async (quizId) => {
  const token = nanoid(12);

  const { data, error } = await supabase
    .from("quizzes")
    .update({ share_token: token })
    .eq("id", quizId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return token;
};

const getQuizByToken = async (token) => {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error || !data) throw new Error("Quiz not found");
  return data;
};

module.exports = {
  createQuiz,
  getQuizById,
  getQuizWithQuestions,
  duplicateQuiz,
  generateShareToken,
  getQuizByToken,
};
