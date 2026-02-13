const express = require("express");
const router = express.Router();
const { getResultsController } = require("../controllers/resultsController");

/**
 * @swagger
 * /api/results/{quizId}:
 *   get:
 *     summary: Récupère le score final et message fun/mignon pour un quiz
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du quiz
 *     responses:
 *       200:
 *         description: Score et messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 partner:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Quiz ID manquant
 *       500:
 *         description: Erreur serveur
 */
router.get("/:quizId", getResultsController);

module.exports = router;
