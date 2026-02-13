const {
  createQuiz,
  getQuizById,
  getQuizWithQuestions,
  duplicateQuiz,
  generateShareToken,
  getQuizByToken,
} = require("../models/Quiz");
const { addQuizQuestions } = require("../models/QuizQuestion");

const createNewQuiz = async ({
  language,
  creatorName,
  partnerName,
  questionCount,
  questions,
}) => {
  // Créer le quiz
  const quiz = await createQuiz({
    language,
    creatorName,
    partnerName,
    questionCount,
  });

  // Ajouter les questions
  await addQuizQuestions(quiz.id, questions);

  return quiz;
};

const fetchQuizById = async (quizId) => {
  return await getQuizWithQuestions(quizId);
};

const duplicateExistingQuiz = async (
  quizId,
  newCreatorName,
  newPartnerName,
) => {
  return await duplicateQuiz(quizId, newCreatorName, newPartnerName);
};

const createShareLink = async (quizId) => {
  return await generateShareToken(quizId);
};

const fetchQuizByShareToken = async (token) => {
  return await getQuizByToken(token);
};

module.exports = {
  createNewQuiz,
  getQuizById,
  fetchQuizById,
  duplicateExistingQuiz,
  createShareLink,
  fetchQuizByShareToken,
};
