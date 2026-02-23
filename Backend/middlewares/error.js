const logger = require("../utils/loggers");


exports.errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 🔁 MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate ${field} entered`;
  }

  // 🔐 JWT invalid
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token, please login again";
  }

  // ⏰ JWT expired
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired, please login again";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // Multer File Size Error
  if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 400;
      message = "File too large. Max 20MB allowed."
    }


  // 📝 Log error
  logger.error("API Error", {
    requestId: req.requestId,
    statusCode,
    message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    message,
    requestId: req.requestId,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack
    })
  });
};
