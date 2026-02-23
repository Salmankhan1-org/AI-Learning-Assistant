const redisClient = require("../../config/redis");
const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");


exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const {
    name,
    address,
    bio,
    dateOfBirth,
    class10Data,
    class12Data
  } = req.body;


  // Fetch user from database
  let user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const skills = req.body.skills ? JSON.parse(req.body.skills) : [];

  // Update basic fields if provided
  if (name) user.name = name;
  if (address) user.address = address;
  if (bio) user.bio = bio;
  if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
  if (skills?.length > 0) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

  // Update education
  if (class10Data) {
    user.education.class10  = req.body.class10Data ? JSON.parse(req.body.class10Data) : null;
  }

  if (class12Data) {
    user.education.class12 = req.body.class12Data ? JSON.parse(req.body.class12Data) : null;
}

  // Update profile image if uploaded
  if (req.file) {
    user.profileImage = {
      imageName: req.file.originalname,
      imageUrl: req.file.path
    };
  }

  await user.save();

  //  Invalidate Redis cache
  const redisKey = `user:${userId}`;
  await redisClient.del(redisKey);

  res.status(200).json({
    success: true,
    message: "User updated successfully"
  });
});
