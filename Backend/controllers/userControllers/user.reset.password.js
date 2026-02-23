const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const crypto = require("crypto");
const ErrorHandler = require("../../utils/ErrorHandler");
const bcrypt = require("bcryptjs");

exports.resetPassword = catchAsyncError(
    async(req,res,next)=>{
        const {token} = req.params;
        const {newPassword} = req.body;

        if(!token){
            return next(new ErrorHandler("Token is required",401));
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: {$gt: Date.now()}
        });

        if(!user){
            return next(new ErrorHandler("Invalid or Expired Token",401));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        user.refreshToken = null;

        await user.save();

        res.status(200).json({
            message : 'Your Password Has been updated. Login again',
            success: true
        })
    }
)