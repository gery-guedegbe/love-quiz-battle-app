const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

console.log("=".repeat(50));
console.log("🚀 Démarrage du serveur Love Quiz Battle");
console.log(`⏰ ${new Date().toISOString()}`);
console.log(`🔧 Environment: ${NODE_ENV}`);
console.log("=".repeat(50));

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`);
  if (NODE_ENV !== "production") {
    console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
  }
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log("-".repeat(50));
  console.log("📡 En attente de requêtes...");
  console.log("-".repeat(50));
});

// Gestion propre de l'arrêt
process.on("SIGTERM", () => {
  console.log("🛑 Signal SIGTERM reçu, arrêt du serveur...");
  server.close(() => {
    console.log("✅ Serveur arrêté proprement");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 Signal SIGINT (Ctrl+C) reçu, arrêt du serveur...");
  server.close(() => {
    console.log("✅ Serveur arrêté proprement");
    process.exit(0);
  });
});
