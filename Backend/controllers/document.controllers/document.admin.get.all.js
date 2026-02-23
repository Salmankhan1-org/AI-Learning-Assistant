const Document = require("../../models/document.schema");
const FlashCard = require("../../models/flashcard.schema");
const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");

exports.getAllDocumentsDetailsByAdmin = catchAsyncError(
  async (req, res, next) => {

    //  Get page & limit from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //  Get total document count
    const totalDocuments = await Document.countDocuments({ isDeleted: false });

    //  Fetch paginated documents
    const allDocs = await Document.find({ isDeleted: false })
      .select("title userId createdAt")
      .populate("userId", "name")
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit)
      .lean(); // important for performance

    const documentIds = allDocs.map(doc => doc._id);

    const totalPages = Math.ceil(totalDocuments / limit);

    //  Flashcard counts (only for current page docs)
    const flashcardCounts = await FlashCard.aggregate([
      {
        $match: {
          isDeleted: false,
          documentId: { $in: documentIds }
        }
      },
      {
        $group: {
          _id: "$documentId",
          total: { $sum: 1 }
        }
      }
    ]);

    //  Quiz counts (only for current page docs)
    const quizCounts = await Quiz.aggregate([
      {
        $match: {
          isDeleted: false,
          documentId: { $in: documentIds }
        }
      },
      {
        $group: {
          _id: "$documentId",
          total: { $sum: 1 }
        }
      }
    ]);

    // Build lookup maps
    const flashcardMap = {};
    flashcardCounts.forEach(item => {
      flashcardMap[item._id.toString()] = item.total;
    });

    const quizMap = {};
    quizCounts.forEach(item => {
      quizMap[item._id.toString()] = item.total;
    });

    //  Merge counts
    const data = allDocs.map(doc => ({
      ...doc,
      countFlashcards: flashcardMap[doc._id.toString()] || 0,
      countQuizzes: quizMap[doc._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      pagination: {
        totalDocuments,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data
    });

  }
);
