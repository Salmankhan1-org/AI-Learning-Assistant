const {body, validationResult} = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler");

exports.loginValidator = [
    body("email")
        .isEmail()
        .notEmpty().withMessage("Email is required")
        .normalizeEmail(),

    body("password")
        .isLength({min:6}).withMessage("Password must have atleast 6 characters"),

    body("captchaToken")
        .notEmpty().withMessage("Captch Token is required"),


    
    (req,res,next)=>{
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
        
]