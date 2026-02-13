const express = require("express");
const router = express.Router();
const {
  getAnalyticsController,
  generateSnapshotController,
} = require("../controllers/analyticsController");

const adminGuard = require("../middlewares/adminGuard");
const adminRateLimiter = require("../middlewares/adminRateLimit");
const { auditLogMiddleware } = require("../middlewares/auditLog");
const { supabase } = require("../config/db");

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get global analytics stats
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Returns global statistics
 */
router.get(
  "/",
  adminRateLimiter,
  adminGuard,
  auditLogMiddleware("GET_ANALYTICS"),
  getAnalyticsController,
);

/**
 * @swagger
 * /api/analytics/snapshot:
 *   post:
 *     summary: Generate analytics snapshot
 *     security:
 *       - ApiKeyAuth: []
 */
router.post(
  "/snapshot",
  adminRateLimiter,
  adminGuard,
  auditLogMiddleware("CREATE_SNAPSHOT"),
  generateSnapshotController,
);

/**
 * @swagger
 * /api/analytics/snapshots:
 *   get:
 *     summary: Get all analytics snapshots
 *     security:
 *       - ApiKeyAuth: []
 */
router.get(
  "/snapshots",
  adminRateLimiter,
  adminGuard,
  auditLogMiddleware("GET_SNAPSHOTS"),
  async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 50, 500);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const { data, count, error } = await supabase
        .from("analytics_snapshots")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      res.json({
        data,
        total: count,
        limit,
        offset,
      });
    } catch (error) {
      console.error("[GET_SNAPSHOTS]", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

module.exports = router;
