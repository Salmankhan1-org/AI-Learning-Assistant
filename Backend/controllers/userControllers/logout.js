const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");

exports.logout = catchAsyncError(
    async (req, res,next)=>{
  
        res.clearCookie('accessToken',{path:'/'});
        res.clearCookie('refreshToken',{path:'/'});

        res.status(200).json({
            message : "User Logout Successfully",
            success : true
        })
}
)