const { calculateGlobalStats, saveSnapshot } = require("../models/Analytics");

const handleError = (err, res, isDev = false) => {
  console.error("[ERROR]", err.message);

  if (isDev) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal server error" });
};

const getAnalyticsController = async (req, res) => {
  try {
    const stats = await calculateGlobalStats();
    res.json(stats);
  } catch (err) {
    handleError(err, res, process.env.NODE_ENV !== "production");
  }
};

const generateSnapshotController = async (req, res) => {
  try {
    const stats = await calculateGlobalStats();
    const snapshot = await saveSnapshot(stats);
    res.json(snapshot);
  } catch (err) {
    handleError(err, res, process.env.NODE_ENV !== "production");
  }
};

module.exports = {
  getAnalyticsController,
  generateSnapshotController,
};
