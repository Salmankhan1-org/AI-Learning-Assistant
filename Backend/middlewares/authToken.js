const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncError } = require("../utils/catchAsyncError");
const redisClient = require("../config/redis");
const User = require("../models/userModel");
const db = require("../config/connectSqliteDb");
const { GetAccessToken } = require("../utils/JWT/get.token.jwt");



exports.isAuthenticated = catchAsyncError(
  async (req, res, next) => {

    const token = GetAccessToken();

    if (!token) {
      return next(new ErrorHandler("Login to access this resource", 401));
    }

 
    db.get(
      `SELECT token FROM tokens WHERE token = ?`,
      [token],
      async (err, row) => {

        if (row) {
          return next(new ErrorHandler("Token expired or revoked. Login again.", 401));
        }

      
        let decodedData;
        try {
          decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
          return next(new ErrorHandler("Invalid Token. Login again", 401));
        }

     
        const redisKey = `user:${decodedData.id}`;
        const cachedUser = await redisClient.get(redisKey);

        if (cachedUser) {
          req.user = JSON.parse(cachedUser);
          return next();
        }

        
        const user = await User.findById(decodedData.id);

        if (!user) {
          return next(new ErrorHandler("User not found", 404));
        }

        await redisClient.set(redisKey, JSON.stringify(user), { EX: 900 });

        req.user = user;

        next();
      }
    );
  }
);


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