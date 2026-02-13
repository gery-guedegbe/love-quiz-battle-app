const { getRandomQuestions } = require("../models/Question");

const fetchQuestions = async (language, count) => {
  return await getRandomQuestions(language, count);
};

module.exports = { fetchQuestions };
