const fs = require("fs");
const path = require("path");
const { supabase } = require("../../config/db");
require("dotenv").config();

// Lire le fichier JSON
const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../../predef-quiz.json"), "utf-8"),
);

async function seedQuestions() {
  for (const q of questions) {
    const { data, error } = await supabase.from("questions").insert([
      {
        type: q.type,
        language: q.language,
        question_text: q.question_text,
        options: q.options,
      },
    ]);

    if (error) {
      console.error("Erreur insertion:", q, error);
    } else {
      console.log("Question insérée:", q.question_text);
    }
  }
  console.log("✅ Toutes les questions ont été insérées !");
}

seedQuestions();
