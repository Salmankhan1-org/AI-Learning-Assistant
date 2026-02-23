const redisClient = require("../../config/redis");
const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.toggleUserStatus = catchAsyncError(
    async(req,res,next)=>{
        const {userId} = req.params;

        if(!userId){
            return next(new ErrorHandler("Please Provide User Id",401));
        }

        const user = await User.findOne({_id:userId, isDeleted:false});

        if(!user){
            return next(new ErrorHandler("User not Found or Deleted",404));
        }

        user.isActive = !user.isActive;

        await user.save();

         //  Invalidate Redis cache
        const redisKey = `user:${userId}`;
        await redisClient.del(redisKey);

        res.status(200).json({
            success: true,
            message : "User Status updated"
        })
    }
)