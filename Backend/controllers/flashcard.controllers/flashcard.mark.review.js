const ActivityLogger = require("../../models/activity.logger.schema");
const FlashCard = require("../../models/flashcard.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.markFlashcardAsReviewed = catchAsyncError(
  async (req, res, next) => {
    const { flashcardId, cardId } = req.params;
    const userId = GetUserId(req);

    if (!flashcardId || !cardId) {
      return next(
        new ErrorHandler("Please provide Flashcard Id and Card Id", 400)
      );
    }

    const flashcard = await FlashCard.findOne({
      _id: flashcardId,
      userId,
      isDeleted: false,
    }).populate("documentId","title");

    if (!flashcard) {
      return next(new ErrorHandler("Flashcard not found", 404));
    }

    const card = flashcard.cards.id(cardId);

    if (!card) {
      return next(new ErrorHandler("Card not found", 404));
    }

    const now = new Date();

    // Prevent multiple increments on same day
    const lastReviewed = card.lastReviewed;

    const isSameDay =
      lastReviewed &&
      lastReviewed.toDateString() === now.toDateString();

    if (!isSameDay) {
      card.reviewCount += 1;
    }

    card.lastReviewed = now;

    await flashcard.save();

    await ActivityLogger.create({
        userId,
        title : `Flashcard of ${flashcard.documentId?.title} marked as reviewed`,
        type : "FLASHCARD_REVIEWED"
    });

    res.status(200).json({
      success: true,
      message: "Card marked as reviewed",
      reviewCount: card.reviewCount,
      lastReviewed: card.lastReviewed,
    });
  }
);
