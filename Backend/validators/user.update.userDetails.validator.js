const { body, validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler");

exports.updateUserDetailsValidator = [

  // Name
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  // Address
  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),

  // Bio
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  // Date of birth
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for dateOfBirth"),

  // Skills (JSON string)
  body("skills")
    .optional()
    .custom((value) => {
      const skills = JSON.parse(value);
      if (!Array.isArray(skills)) {
        throw new Error("Skills must be an array");
      }
      skills.forEach(skill => {
        if (typeof skill !== "string" || skill.length > 30) {
          throw new Error("Each skill must be a string with max 30 characters");
        }
      });
      return true;
    }),

  // Class 10 education
  body("class10Data")
    .optional()
    .custom((value) => {
      const data = JSON.parse(value);

      if (!data.schoolName || typeof data.schoolName !== "string") {
        throw new Error("Class 10 school name is required");
      }

      if (data.percentage < 0 || data.percentage > 100) {
        throw new Error("Class 10 percentage must be between 0 and 100");
      }

      if (data.startDate && isNaN(Date.parse(data.startDate))) {
        throw new Error("Invalid Class 10 start date");
      }

      if (data.endDate && isNaN(Date.parse(data.endDate))) {
        throw new Error("Invalid Class 10 end date");
      }

      return true;
    }),

  // Class 12 education
  body("class12Data")
    .optional()
    .custom((value) => {
      const data = JSON.parse(value);

      if (!data.schoolName || typeof data.schoolName !== "string") {
        throw new Error("Class 12 school name is required");
      }

      if (data.percentage < 0 || data.percentage > 100) {
        throw new Error("Class 12 percentage must be between 0 and 100");
      }

      if (data.startDate && isNaN(Date.parse(data.startDate))) {
        throw new Error("Invalid Class 12 start date");
      }

      if (data.endDate && isNaN(Date.parse(data.endDate))) {
        throw new Error("Invalid Class 12 end date");
      }

      return true;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(
            new ErrorHandler(errors.array()[0].message, 400)
            );
        }

        next();
    }
];
