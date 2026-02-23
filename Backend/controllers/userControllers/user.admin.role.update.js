const redisClient = require("../../config/redis");
const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.updateUserRole = catchAsyncError(
    async(req,res,next)=>{
        const {role} = req.body;
        const {userId} = req.params;

        if(!['student','admin'].includes(role)){
            return next(new ErrorHandler("Invalid Role Type", 401));
        }

        const user = await User.findOne({_id : userId, isDeleted: false});

        if(!user){
            return next(new ErrorHandler("User not Found or Deleted",404));
        }

        await User.findByIdAndUpdate(userId, {role}, {new: true});

         //  Invalidate Redis cache
        const redisKey = `user:${userId}`;
        await redisClient.del(redisKey);

        res.status(200).json({
            success: true,
            message : "User Role Updated"
        });

    }
)