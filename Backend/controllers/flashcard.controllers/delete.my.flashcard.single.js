const ActivityLogger = require("../../models/activity.logger.schema");
const FlashCard = require("../../models/flashcard.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.deleteMySingleFlashcard = catchAsyncError(
    async(req,res,next)=>{
        const {flashcardId} = req.params;
        const userId = GetUserId(req);

        if(!flashcardId){
            return next(new ErrorHandler("Please Provide Document Id", 401));
        }

        const flashcard = await FlashCard
        .findById(flashcardId)
        .populate("documentId","title");


        if(!flashcard){
            return next(new ErrorHandler("Flashcard not found",404));
        }

        flashcard.isDeleted = true;

        await flashcard.save();

        // Save the Flashcard Deleted Activity in Activity Logger
        await ActivityLogger.create({
            userId,
            title : `Flashcard of ${flashcard.documentId?.title} has been deleted`,
            type : "FLASHCARD_DELETED"
        });

        res.status(200).json({
            success : true,
            message : "Flashcard has been Deleted Successfully"
        });
    }
)