const FlashCard = require("../../models/flashcard.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.getMyFlashcards = catchAsyncError(
    async(req,res,next)=>{
        const {documentId} = req.params;
        const userId = req.user._id;

        if(!documentId){
            return next(new ErrorHandler("Please Provide Document Id", 401));
        }

        const flashcards = await FlashCard.find({documentId, userId, isDeleted:false});

    
        res.status(200).json({
            success : true,
            data : flashcards
        });
    }
)