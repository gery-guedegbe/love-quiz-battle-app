const express = require("express");
const router = express.Router();
const { submitAnswerController } = require("../controllers/answersController");

/**
 * @swagger
 * /api/answers:
 *   post:
 *     summary: Soumettre la réponse d'un joueur pour une question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quizId:
 *                 type: string
 *               playerType:
 *                 type: string
 *                 enum: [creator, partner]
 *               questionId:
 *                 type: string
 *               selectedOptionIndex:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Réponse enregistrée
 *       400:
 *         description: Erreur ou réponse déjà soumise
 *       500:
 *         description: Erreur serveur
 */
router.post("/", submitAnswerController);

module.exports = router;
