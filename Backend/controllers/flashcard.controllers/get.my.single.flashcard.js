
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const FlashCard = require("../../models/flashcard.schema");

exports.getMySingleFlashcard = catchAsyncError(
    async(req,res,next)=>{
        const {flashcardId} = req.params;

        if(!flashcardId){
            return next(new ErrorHandler("Please Provide Flashcard Id",401));
        }

        const flashcard = await FlashCard.findById(flashcardId);

        if(!flashcard){
            return next(new ErrorHandler("Flashcard not Found",404));
        }

        res.status(200).json({
            success : true,
            data : flashcard
        })
    }
)