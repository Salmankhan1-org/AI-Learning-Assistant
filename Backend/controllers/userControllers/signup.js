const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const {  generateAccessToken, generateRefreshToken, generateToken } = require("../../utils/generateToken");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/sendEmail");
const axios = require("axios");
const verifyEmailTemplate = require("../../templates/verify.email.template");

exports.signup = catchAsyncError(
    async(req,res,next)=>{
        const {name, email, password, captchaToken} = req?.body;
    
        // Basic validation 
        if(!name || !email || !password || !captchaToken ){
            return next(new ErrorHandler("Missing required fields", 400));
        }

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
        // check if user already exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new ErrorHandler("User with this email already exists", 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,email, password: hashedPassword, role
        });

        // Send Email to User for Verifying the Email
        //Create a 6 digit code 

        const otp = Math.floor( 100000 + Math.random() * 900000 ).toString();
        // Hash otp for secure registration
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
        //store hashed otp in db
        newUser.emailVerificationCode = hashedOtp;
        newUser.emailVerificationExpiry = Date.now() + 10 * 60 * 1000;

        await newUser.save();


        const mailOptions = {
            to : newUser?.email,
            subject : "Verify your email",
            html : verifyEmailTemplate({
                name : newUser.name,
                otp 
            })
        }

        try {
            await sendEmail(mailOptions);
            generateToken(res, newUser, 200, `Email has been sent to ${newUser?.email}`)
        } catch (error) {
            newUser.resetPasswordToken = undefined;
            newUser.resetPasswordExpiry = undefined;
            await newUser.save();

            res.status(500).json({
                message: "Email could not be sent. Try again",
                success:false
            })
        }
    }
)