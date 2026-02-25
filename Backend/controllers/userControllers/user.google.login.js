const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const {
  generateToken
} = require("../../utils/JWT/generateToken");
const { verifyGoogleToken } = require("../../utils/verify.google.token");
const bcrypt = require("bcryptjs");

exports.googleLogin = catchAsyncError(async (req, res, next) => {
  const {name, email, picture} = req.body;


  let user = await User.findOne({email});

  // if user already exist then login otherwise Create a new Account with that email

  if(user){
    user.isEmailVerified = true;
  }else{
    let password = "login#through#google"
    const hashedPassword = await bcrypt.hash(password,10);
    user = new User({name,email,password:hashedPassword,isEmailVerified:true,profileImage:picture});
  }

  await user.save();

  generateToken(res, user, 200, "User Logged in Successfully");

//   if (!email_verified) {
//     return next(new ErrorHandler("Google email not verified", 403));
//   }



  // 🔍 Find or create user
//   let user = await User.findOne({ email });

//   if (!user) {
//     user = await User.create({
//       name,
//       email,
//       googleId,
//       avatar: picture,
//       authProvider: "google"
//     });
//   }

//   // 🔑 Generate tokens
//   const accessToken = generateAccessToken(user._id);
//   const refreshToken = generateRefreshToken(user._id);

//   user.refreshToken = refreshToken;
//   await user.save();

//   // 🍪 Store refresh token securely
//   res.cookie("token", refreshToken, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false, // true in production (HTTPS)
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     )
//   });

//   res.status(200).json({
//     success: true,
//     message: "Google login successful",
//     accessToken
//   });
});
