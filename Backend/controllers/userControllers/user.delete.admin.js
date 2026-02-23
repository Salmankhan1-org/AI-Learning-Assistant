const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.deleteUserByAdmin = catchAsyncError(
    async(req,res,next)=>{
        const {userId} = req.params;

        if(!userId){
            return next(new ErrorHandler("Please Provide User Id", 401));
        }

        const user = await User.findById(userId);

        if(!user){
            return next(new ErrorHandler("User not found",404));
        }

        user.isActive = false;
        user.isDeleted = true;

        await user.save();

        res.status(200).json({
            success: true,
            message : "User Deleted Successfully"
        });
    }
)