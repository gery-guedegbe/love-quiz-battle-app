const { supabase } = require("../config/db");

const getRandomQuestions = async (language, count) => {
  const { data, error } = await supabase.rpc("get_random_questions", {
    lang: language,
    q_count: count,
  });

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { getRandomQuestions };
