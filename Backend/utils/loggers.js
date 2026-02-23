const { createLogger, format, transports } = require("winston");
const { combine, timestamp, errors, json } = format;

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    errors({ stack: true }) // capture stack trace
  ),
  transports: [

    // Errors file
    new transports.File({
      filename: "./logs/error.log",
      level: "error",
      format: combine(
        timestamp(),
        json() // structured JSON
      )
    }),

    // Combined file
    new transports.File({
      filename: "./logs/combined.log",
      format: combine(
        timestamp(),
        json()
      )
    })
  ],
  exitOnError: false
});

module.exports = logger;
