const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const crypto = require("crypto");

exports.verifyEmail = catchAsyncError(
    async(req,res,next)=>{
        const {otpValue:otp} = req.body;

        if(!otp){
            return next(new ErrorHandler("No OTP recieved! Please Enter OTP"))
        }

        // create hash of otp to find the user
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        // find user
        const user = await User.findOne({
            emailVerificationCode : hashedOtp,
            emailVerificationExpiry : {$gt:Date.now()}
        });

        if(!user){
            return next(new ErrorHandler("Incorrect or Expired OTP"));
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save();

        res.status(200).json({
            message : "Email has been verified",
            success:true
        });
    }
)