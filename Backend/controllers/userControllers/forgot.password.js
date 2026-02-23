const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/sendEmail");
const resetPasswordEmailTemplate = require("../../templates/reset.password.email.template");

exports.forgotPassword = catchAsyncError(
    async(req,res,next)=>{
        const {email} = req.body;

        if(!email){
            return next(new ErrorHandler("Email is required",401));
        }
        
        //find user with this email
        const user = await User.findOne({email});
        if(!user){
            return next(new ErrorHandler("No User exist with this email",401));
        }

        // Create a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

        await user.save({validateBeforeSave:true});

        const resetUrl = `${process.env.FRONTEND_URL}/user/auth/reset-password/${resetToken}`

        const mailOptions = {
        to: user.email,
        subject: "Reset Your Password",
        html: resetPasswordEmailTemplate({
            name: user.name,
            resetUrl,
        }),
        };

        try {
            await sendEmail(mailOptions);
            res.status(200).json({
                success:true,
                message: `Email has been sent to ${user.email}`,
                resetUrl
        })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiry = undefined;
            await user.save();

            res.status(500).json({
                message: "Email could not be sent. Try again",
                success:false
            })
        }

        
    }
)