const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./config/swagger");
require("dotenv").config();

const questionsRoutes = require("./routes/questions");
const quizzesRoutes = require("./routes/quizzes");
const answersRoutes = require("./routes/answers");
const resultsRoutes = require("./routes/results");
const healthRoutes = require("./routes/health");
const analyticsRoutes = require("./routes/analytics");

const app = express();

// ===== TRUST PROXY (Required for Render & reverse proxies) =====
// Tells Express to trust X-Forwarded-* headers from the reverse proxy
// This fixes: "X-Forwarded-For header is set but trust proxy is false"
app.set("trust proxy", 1);

// ===== SECURE HEADERS & HTTPS ENFORCEMENT =====
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 63072000, // 2 years
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// Enforce HTTPS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(301, `https://${req.header("host")}${req.url}`);
    }
    next();
  });
}

// ===== CORS CONFIGURATION =====
const allowedOrigins = [process.env.FRONTEND_DOMAIN || "http://localhost:3000"];

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:3000", "http://localhost:3001");
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Key"],
  }),
);

// ===== REQUEST SIZE LIMITS =====
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb" }));

// ===== CUSTOM LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log with hashed IP for privacy
  const crypto = require("crypto");
  const hashedIp = crypto
    .createHash("sha256")
    .update(req.ip || "unknown")
    .digest("hex")
    .substring(0, 8);

  console.log(
    `[${new Date().toISOString()}] 📥 ${req.method} ${req.url} - IP: ${hashedIp}`,
  );

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusColor =
      res.statusCode >= 400 ? "🔴" : res.statusCode >= 300 ? "🟡" : "🟢";

    console.log(
      `[${new Date().toISOString()}] ${statusColor} ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`,
    );
  });

  next();
});

// ===== PUBLIC RATE LIMITING =====
const publicLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests from this IP, try again later",
  standardHeaders: false,
  skip: (req) => req.path === "/api/health",
});

app.use(publicLimiter);

// Routes
app.use("/api/questions", questionsRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/answers", answersRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/analytics", analyticsRoutes);

// ===== SWAGGER DOCS (Dev Only) =====
if (process.env.NODE_ENV !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📚 Swagger docs available at /api/docs");
}

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("[ERROR]", {
    message: err.message,
    code: err.code,
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details to client
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

module.exports = app;
