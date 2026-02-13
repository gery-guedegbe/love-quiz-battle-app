const { nanoid } = require("nanoid");
const {
  createNewQuiz,
  fetchQuizById,
  duplicateExistingQuiz,
  fetchQuizByShareToken,
  createShareLink,
} = require("../services/quizzesService");

const handleError = (err, res, isDev = false) => {
  console.error("[ERROR]", err.message);

  // Return generic error in production
  if (isDev) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal server error" });
};

/**
 * POST /api/quizzes
 * Body:
 *  - language: fr/en
 *  - creatorName
 *  - partnerName
 *  - questionCount: 8 | 15 | 20
 *  - questions: array[{ questionText, type, options, correctAnswerIndex, isCustom }]
 */
const createQuizController = async (req, res) => {
  try {
    const { language, creatorName, partnerName, questionCount, questions } =
      req.body;

    if (
      !language ||
      !creatorName ||
      !partnerName ||
      !questionCount ||
      !questions
    ) {
      return res.status(400).json({ error: "MISSING_FIELDS" });
    }

    const shareToken = nanoid(32);

    const quiz = await createNewQuiz({
      language,
      creatorName,
      partnerName,
      questionCount,
      questions,
      shareToken,
    });

    res.status(201).json({
      quizId: quiz.id,
      shareToken,
    });
  } catch (error) {
    handleError(error, res, process.env.NODE_ENV !== "production");
  }
};

/**
 * GET /api/quizzes/:id
 * Params:
 *  - id: quizId
 */
const getQuizController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Quiz ID required" });

    const quiz = await fetchQuizById(id);
    res.json(quiz);
  } catch (error) {
    if (error.message === "Quiz not found") {
      return res.status(404).json({ error: "Quiz not found" });
    }
    if (error.message === "QUIZ_EXPIRED") {
      return res.status(410).json({ error: "Quiz expired" });
    }
    handleError(error, res, process.env.NODE_ENV !== "production");
  }
};

/**
 * GET /api/quizzes/:id/duplicate
 * Params:
 *  - id: quizId à dupliquer
 * Query (optionnel):
 *  - newCreatorName
 *  - newPartnerName
 */
const duplicateQuizController = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCreatorName, newPartnerName } = req.query;

    if (!id) return res.status(400).json({ error: "Quiz ID required" });

    const newQuiz = await duplicateExistingQuiz(
      id,
      newCreatorName,
      newPartnerName,
    );
    res.json({ newQuizId: newQuiz.id });
  } catch (error) {
    if (error.message === "Quiz not found") {
      return res.status(404).json({ error: "Quiz not found" });
    }
    handleError(error, res, process.env.NODE_ENV !== "production");
  }
};

/**
 * POST /api/quizzes/:id/share
 * Génère un lien partageable vers le frontend Vercel
 */
const shareQuizController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Quiz ID required" });

    const quiz = await fetchQuizById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (new Date(quiz.expires_at) < new Date()) {
      return res.status(410).json({ error: "Quiz expired" });
    }

    // Crée un token unique
    const token = await createShareLink(id);

    // Domaine frontend configurable via variable d'environnement
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    const shareLink = `${frontendDomain}/play/${token}`;

    res.json({ shareLink });
  } catch (error) {
    if (error.message === "Quiz not found") {
      return res.status(404).json({ error: "Quiz not found" });
    }
    handleError(error, res, process.env.NODE_ENV !== "production");
  }
};

/**
 * GET /api/quizzes/share/:token
 * Récupère le quiz depuis le token
 */
const getQuizByShareTokenController = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: "Token required" });

    const quiz = await fetchQuizByShareToken(token);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (new Date(quiz.expires_at) < new Date()) {
      return res.status(410).json({ error: "Quiz expired" });
    }

    res.json(quiz);
  } catch (error) {
    if (error.message === "Quiz not found") {
      return res.status(404).json({ error: "Quiz not found" });
    }
    handleError(error, res, process.env.NODE_ENV !== "production");
  }
};

module.exports = {
  createQuizController,
  getQuizController,
  shareQuizController,
  getQuizByShareTokenController,
  duplicateQuizController,
};
