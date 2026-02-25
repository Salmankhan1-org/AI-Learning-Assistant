const ActivityLogger = require("../../models/activity.logger.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.getRecentUserActivities = catchAsyncError(
    async(req,res,next)=>{
        const userId = GetUserId(req);

        const activities = await ActivityLogger.find({userId}).sort({createdAt:-1}).limit(10);

        res.status(200).json({
            success: true,
            data : activities
        });

    }
)