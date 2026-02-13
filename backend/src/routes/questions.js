const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionsController");

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Récupère des questions aléatoires pour le quiz
 *     description: Retourne X questions prédéfinies selon la langue choisie
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [fr, en]
 *         required: true
 *         description: Langue du quiz
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           enum: [8, 15, 20]
 *         required: true
 *         description: Nombre de questions
 *     responses:
 *       200:
 *         description: Liste de questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   question_text:
 *                     type: string
 *                   options:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         text:
 *                           type: string
 *                         index:
 *                           type: integer
 *       400:
 *         description: Paramètre invalide
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getQuestions);

module.exports = router;
