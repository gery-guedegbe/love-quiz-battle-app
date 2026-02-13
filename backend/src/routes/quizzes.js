const express = require("express");
const router = express.Router();
const {
  createQuizController,
  getQuizController,
  shareQuizController,
  getQuizByShareTokenController,
  duplicateQuizController,
} = require("../controllers/quizzesController");

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Crée un nouveau quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:-
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [fr, en]
 *               creatorName:
 *                 type: string
 *               partnerName:
 *                 type: string
 *               questionCount:
 *                 type: integer
 *                 enum: [8, 15, 20]
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionText:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [yesno, multiple]
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                           index:
 *                             type: integer
 *                     correctAnswerIndex:
 *                       type: integer
 *                     isCustom:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Quiz créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quizId:
 *                   type: string
 *       400:
 *         description: Payload invalide
 *       500:
 *         description: Erreur serveur
 */
router.post("/", createQuizController);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Récupère un quiz existant avec ses questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du quiz à récupérer
 *     responses:
 *       200:
 *         description: Quiz avec questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 language:
 *                   type: string
 *                 creator_name:
 *                   type: string
 *                 partner_name:
 *                   type: string
 *                 question_count:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                 expires_at:
 *                   type: string
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       question_text:
 *                         type: string
 *                       type:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             text:
 *                               type: string
 *                             index:
 *                               type: integer
 *                       correct_answer_index:
 *                         type: integer
 *                       is_custom:
 *                         type: boolean
 *                       order_index:
 *                         type: integer
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getQuizController);

/**
 * @swagger
 * /api/quizzes/{id}/duplicate:
 *   get:
 *     summary: Duplique un quiz existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du quiz à dupliquer
 *       - in: query
 *         name: newCreatorName
 *         schema:
 *           type: string
 *         description: Nouveau nom du créateur (optionnel)
 *       - in: query
 *         name: newPartnerName
 *         schema:
 *           type: string
 *         description: Nouveau nom du partenaire (optionnel)
 *     responses:
 *       200:
 *         description: Quiz dupliqué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newQuizId:
 *                   type: string
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get("/:id/duplicate", duplicateQuizController);

/**
 * @swagger
 * /api/quizzes/{id}/share:
 *   post:
 *     summary: Génère un lien unique partageable pour un quiz
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du quiz à partager
 *     responses:
 *       200:
 *         description: Lien de partage généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareLink:
 *                   type: string
 *       400:
 *         description: Quiz ID manquant
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/share", shareQuizController);

/**
 * @swagger
 * /api/quizzes/share/{token}:
 *   get:
 *     summary: Récupère un quiz via son lien de partage
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de partage
 *     responses:
 *       200:
 *         description: Quiz récupéré
 *       404:
 *         description: Quiz non trouvé
 */
router.get("/share/:token", getQuizByShareTokenController);

module.exports = router;
