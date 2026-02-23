const ActivityLogger = require("../../models/activity.logger.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");

exports.getRecentUserActivities = catchAsyncError(
    async(req,res,next)=>{
        const userId = req.user._id;

        const activities = await ActivityLogger.find({userId}).sort({createdAt:-1}).limit(10);

        res.status(200).json({
            success: true,
            data : activities
        });

    }
)