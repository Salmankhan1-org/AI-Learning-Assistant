const Document = require("../../models/document.schema");
const FlashCard = require("../../models/flashcard.schema");
const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const mongoose = require("mongoose");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.getAllDocuments = catchAsyncError(async (req, res, next) => {
  const userId = GetUserId(req);

 const userObjectId = new mongoose.Types.ObjectId(userId);

  if (!userId) {
    return next(new ErrorHandler("Login to Access", 401));
  }

  //  Fetch documents
  const documents = await Document.find({
    userId,
    isDeleted: false
  }).lean();

  //  Flashcard counts
  const flashcardCounts = await FlashCard.aggregate([
    { $match: { userId: userObjectId , isDeleted:false } },
    {
      $group: {
        _id: "$documentId",
        total: { $sum: 1 }
      }
    }
  ]);

  //  Quiz counts
  const quizCounts = await Quiz.aggregate([
    { $match: { userId , isDeleted : false } },
    {
      $group: {
        _id: "$documentId",
        total: { $sum: 1 }
      }
    }
  ]);

  //  Build lookup maps
  const flashcardMap = {};
  flashcardCounts.forEach(item => {
    flashcardMap[item._id.toString()] = item.total;
  });

  const quizMap = {};
  quizCounts.forEach(item => {
    quizMap[item._id.toString()] = item.total;
  });

  //  Merge counts
  const data = documents.map(doc => ({
    ...doc,
    countFlashcards: flashcardMap[doc._id.toString()] || 0,
    countQuizzes: quizMap[doc._id.toString()] || 0
  }));

  res.status(200).json({
    success: true,
    data
  });
});
