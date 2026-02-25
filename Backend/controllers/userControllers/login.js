const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const {  generateToken } = require("../../utils/JWT/generateToken");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const axios = require("axios")

exports.login = catchAsyncError(
    async(req, res, next) =>{
        const {email, password, captchaToken} = req?.body;
        //Basic validation
        if(!email || !password || !captchaToken){
            return next(new ErrorHandler("Missing required fields", 400));
        }

        //Verify the captcha 
        const captchaResponse = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken
            }
            }
        );

        if (!captchaResponse.data.success) {
            return next(new ErrorHandler("Captcha verification failed", 403));
        }
        // Check if user with this email exists or not
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Invalid email or password", 401));
        }
        
        // Check if password is correct or not
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return next(new ErrorHandler("Invalid email or password",401));
        }

        generateToken(res, user, 200, "User Logged in Successfully");

    }
)