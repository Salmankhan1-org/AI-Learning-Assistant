const { body, validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler");

exports.signupValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("email")
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    

  body("role")
    .isIn(["student","admin"])
    .withMessage("Role is required"),
    
  // 🧠 Final error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ErrorHandler(
          errors.array().map(err => err.msg).join(", "),
          400
        )
      );
    }
    next();
  }
];
