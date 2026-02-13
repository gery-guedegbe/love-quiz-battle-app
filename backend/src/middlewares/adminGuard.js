const crypto = require("crypto");

const adminGuard = (req, res, next) => {
  const key = req.headers["x-admin-key"];

  if (!key) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const expected = Buffer.from(process.env.ADMIN_ANALYTICS_KEY || "");
  const actual = Buffer.from(key);

  if (!crypto.timingSafeEqual(expected, actual)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
};

module.exports = adminGuard;
