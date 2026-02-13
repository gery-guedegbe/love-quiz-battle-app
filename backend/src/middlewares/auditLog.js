const { supabase } = require("../config/db");
const crypto = require("crypto");

const auditLog = async (action, adminKey, details = {}) => {
  try {
    const keyHash = crypto
      .createHash("sha256")
      .update(adminKey || "")
      .digest("hex")
      .substring(0, 16);

    await supabase.from("admin_audit_logs").insert([
      {
        action,
        admin_key_hash: keyHash,
        details: JSON.stringify(details),
        ip_address: details.ip || "unknown",
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    // Log error but don't break the request
    console.error("[AUDIT_LOG_ERROR]", error.message);
  }
};

const auditLogMiddleware = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      // Log audit after response
      auditLog(action, req.headers["x-admin-key"], {
        ip: req.ip,
        method: req.method,
        path: req.path,
        status: res.statusCode,
      }).catch((err) => {
        console.error("[AUDIT_LOG_ASYNC]", err.message);
      });

      res.send = originalSend;
      return res.send(data);
    };

    next();
  };
};

module.exports = { auditLog, auditLogMiddleware };
