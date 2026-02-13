const express = require("express");
const router = express.Router();
const { supabase } = require("../config/db");

/**
 * GET /api/health
 * Route pour vérifier que le serveur est en ligne et connecté à la DB
 */
router.get("/", async (req, res) => {
  try {
    // Test database connectivity
    const { data, error } = await supabase
      .from("quizzes")
      .select("id")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is fine
      throw error;
    }

    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[HEALTH_CHECK]", err.message);
    res.status(503).json({
      status: "degraded",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
