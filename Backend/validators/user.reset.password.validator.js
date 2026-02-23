const { body, validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler");

exports.resetPasswordValidator = [

    body("newPassword")
        .notEmpty()
        .isLength({min:6}).withMessage("Password must have 6  characters"),

    
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
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