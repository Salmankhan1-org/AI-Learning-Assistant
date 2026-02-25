const db = require("../../config/connectSqliteDb");
const redisClient = require("../../config/redis");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const { GetAccessToken } = require("../../utils/JWT/get.token.jwt");

exports.logout = catchAsyncError(
  async (req, res, next) => {

    const userId = req.user?._id;

    const accessToken = GetAccessToken(req);

    if (accessToken) {
      db.run(
        `INSERT INTO tokens (token) VALUES (?)`,
        [accessToken],
        function (err) {
          if (err) {
            console.error("Error blacklisting token:", err);
          }
        }
      );
    }

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    // remove user from redis cache
    const redisKey = `user:${userId}`;
    await redisClient.del(redisKey);

    res.status(200).json({
      message: "User Logout Successfully",
      success: true,
    });
  }
);