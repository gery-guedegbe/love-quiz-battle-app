const { supabase } = require("../config/db");

const addQuizQuestions = async (quizId, questions) => {
  const formattedQuestions = questions.map((q, index) => ({
    quiz_id: quizId,
    question_text: q.question_text,
    type: q.type,
    options: q.options,
    correct_answer_index: q.correct_answer_index,
    is_custom: q.is_custom || false,
    order_index: index,
  }));

  const { data, error } = await supabase
    .from("quiz_questions")
    .insert(formattedQuestions);

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { addQuizQuestions };
