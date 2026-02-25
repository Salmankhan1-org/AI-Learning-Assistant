const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const crypto = require("crypto");
const ErrorHandler = require("../../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const db = require("../../config/connectSqliteDb");
const { GetAccessToken } = require("../../utils/JWT/get.token.jwt");

exports.resetPassword = catchAsyncError(
    async(req,res,next)=>{
        const {token} = req.params;
        const {newPassword} = req.body;
        const accessToken = GetAccessToken();

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


        await user.save();


        // Blacklist the current token after password reset
        if (accessToken) {
            db.run(
            `INSERT INTO tokens (token) VALUES (?)`,
            [accessToken],
            function (err) {
                if (err) {
                    console.error("Error blacklisting token:", err);
                }
            }
            );
        }

        res.status(200).json({
            message : 'Your Password Has been updated. Login again',
            success: true
        })
    }
)