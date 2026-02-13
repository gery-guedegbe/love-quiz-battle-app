const {
  getAnswersByQuizId,
  getQuestionsByQuizId,
} = require("../models/Result");

const calculateResults = async (quizId) => {
  const answers = await getAnswersByQuizId(quizId);
  const questions = await getQuestionsByQuizId(quizId);

  const results = {
    creator: { score: 0, total: questions.length },
    partner: { score: 0, total: questions.length },
    messages: [],
  };

  // Calculer score par joueur
  for (const q of questions) {
    const creatorAnswer = answers.find(
      (a) => a.player_type === "creator" && a.question_id === q.id,
    );

    const partnerAnswer = answers.find(
      (a) => a.player_type === "partner" && a.question_id === q.id,
    );

    if (
      creatorAnswer &&
      creatorAnswer.selected_option_index === q.correct_answer_index
    ) {
      results.creator.score += 1;
    }

    if (
      partnerAnswer &&
      partnerAnswer.selected_option_index === q.correct_answer_index
    ) {
      results.partner.score += 1;
    }
  }

  // Générer message fun/mignon global
  const totalScore = results.creator.score + results.partner.score;
  const maxScore = 2 * questions.length;

  if (totalScore === maxScore) {
    results.messages.push(
      "Perfect match! ❤️ Vous êtes faits l'un pour l'autre !",
    );
  } else if (totalScore >= maxScore * 0.75) {
    results.messages.push("Très bien ! 🌟 Il y a de l'amour dans l'air !");
  } else if (totalScore >= maxScore * 0.5) {
    results.messages.push(
      "Hmm 😅 Vous ne vous connaissez pas encore assez… il va falloir apprendre à mieux vous découvrir !",
    );
  } else {
    results.messages.push("Oh oh 😬 Attention, quelqu'un pourrait être fâché…");
  }

  return results;
};

module.exports = { calculateResults };
