const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const { GetRefreshToken } = require("../../utils/JWT/get.jwt.refresh.token");

exports.refreshToken = catchAsyncError(async (req, res, next) => {
  //  Get refresh token 
  const refreshToken = GetRefreshToken();

  if (!refreshToken) {
    return next(new ErrorHandler("No refresh token found. Login again", 401));
  }

  //  Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired refresh token", 401));
  }

  //  Check user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 401));
  }

  //  Generate new access token
  const newAccessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  //  (Optional but recommended) Rotate refresh token
  const newRefreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  };

  //  Set new cookies
  res.cookie("accessToken", newAccessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", newRefreshToken, {
    ...cookieOptions,
    maxAge: Number(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
  });

  //  Respond (no tokens in body)
  res.status(200).json({
    success: true,
    message: "Token refreshed successfully"
  });
});
