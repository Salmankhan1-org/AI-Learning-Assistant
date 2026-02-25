require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateToken = async (res, user, statusCode, message) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  };

  // Access Token (short-lived)
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000
  });

  // Refresh Token (long-lived)
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: Number(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
  });

  res.status(statusCode).json({
    success: true,
    message,
    user
  });
};
