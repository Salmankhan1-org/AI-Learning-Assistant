const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");

exports.getAllUsersByAdmin = catchAsyncError(async (req, res) => {


  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  
  const totalUsers = await User.countDocuments();


  const users = await User.find({isDeleted:false})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-password"); 
 
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      totalUsers,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});
