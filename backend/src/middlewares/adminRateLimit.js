const rateLimit = require("express-rate-limit");

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Much stricter than public (100/hour)
  keyGenerator: (req) => {
    return `admin-${req.ip}-${req.headers["x-admin-key"] || "unknown"}`;
  },
  message: "Too many admin requests. Please try again later.",
  standardHeaders: false,
  skip: (req) => {
    // Continue even if limit reached, let adminGuard handle auth
    return false;
  },
});

module.exports = adminLimiter;
