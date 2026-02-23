const { catchAsyncError } = require("../../utils/catchAsyncError");

exports.getUserDetails = catchAsyncError(
    async(req,res,next)=>{
        const user = req?.user;

        res.status(200).json({
            message: "User Details Fetched",
            success : true,
            data : user
        })
    }
)