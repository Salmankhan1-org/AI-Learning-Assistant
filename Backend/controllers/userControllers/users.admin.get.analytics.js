const Document = require("../../models/document.schema");
const FlashCard = require("../../models/flashcard.schema");
const Quiz = require("../../models/quiz.schema");
const User = require("../../models/userModel");
const { catchAsyncError } = require("../../utils/catchAsyncError");


exports.getAdminAnalytics = catchAsyncError(async (req, res) => {

  //  Total Counts (run in parallel)
  const [
    totalUsers,
    totalDocuments,
    totalFlashcards,
    totalQuizzes,
    usersPerMonth,
    documentsPerMonth
  ] = await Promise.all([

    User.countDocuments(),
    Document.countDocuments(),
    FlashCard.countDocuments(),
    Quiz.countDocuments(),

    //  Users Per Month
    User.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]),

    //  Documents Per Month
    Document.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ])
  ]);

  // Helper to convert month number to short name
  const formatMonth = (monthNumber) => {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    return months[monthNumber - 1];
  };

  // Format Users Per Month
  const formattedUsersPerMonth = usersPerMonth.map(item => ({
    month: formatMonth(item._id.month),
    total: item.total
  }));

  // Format Documents Per Month
  const formattedDocumentsPerMonth = documentsPerMonth.map(item => ({
    month: formatMonth(item._id.month),
    total: item.total
  }));

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalDocuments,
      totalFlashcards,
      totalQuizzes,
      usersPerMonth: formattedUsersPerMonth,
      documentsPerMonth: formattedDocumentsPerMonth
    }
  });

});
