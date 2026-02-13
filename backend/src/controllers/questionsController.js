const { fetchQuestions } = require("../services/questionsService");

const handleError = (err, res, isDev = false) => {
  console.error("[ERROR]", err.message);

  if (isDev) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal server error" });
};

/**
 * GET /api/questions
 * Query params:
 *  - language: fr/en
 *  - count: 8 | 15 | 20
 */
const getQuestions = async (req, res) => {
  try {
    const { language, count } = req.query;
    if (!language || !count)
      return res.status(400).json({ error: "language and count required" });

    const questions = await fetchQuestions(language, Number(count));
    res.json(questions);
  } catch (error) {
    handleError(error, res, process.env.NODE_ENV !== "production");
  }
};

module.exports = { getQuestions };
