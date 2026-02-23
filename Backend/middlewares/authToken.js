const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncError } = require("../utils/catchAsyncError");
const redisClient = require("../config/redis");
const User = require("../models/userModel");

exports.isAuthenticated = catchAsyncError(
    async (req, res, next) =>{
    const token = req?.cookies?.accessToken;

    if(!token){
        return next(new ErrorHandler("login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if(!decodedData){
        return next(new ErrorHandler("Invalid Token. Login again", 401));
    }

    // check in the redis if user exist or not
    const redisKey = `user:${decodedData.id}`

    const cachedUser = await redisClient.get(redisKey);

    if(cachedUser){
        req.user = JSON.parse(cachedUser);
        return next();
    }

    const user = await User.findById(decodedData.id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    await redisClient.set(redisKey,JSON.stringify(user),{EX:900});

    req.user = user;

    next();
}
)


// Check if user is Admin or not
exports.isAdmin = catchAsyncError(
    async(req,res,next)=>{
        const user = req.user;

        if(user.role !== 'admin'){
            return next(new ErrorHandler("Access Denied",401));
        }

        next();
    }
)