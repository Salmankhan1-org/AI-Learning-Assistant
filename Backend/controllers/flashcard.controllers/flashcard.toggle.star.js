const FlashCard = require("../../models/flashcard.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.toggleStartCard = catchAsyncError(
    async(req,res,next)=>{
        const {flashcardId, cardId} = req.params;
        const userId = GetUserId(req);

        if(!flashcardId){
            return next(new ErrorHandler("Please Provide Flashcard Id",401));
        }

        const flashcard = await FlashCard.findOne({_id : flashcardId, userId, isDeleted:false});

        if(!flashcard ){
            return next(new ErrorHandler(" Flashcard not Found ",404));
        }

        // Mark a card of a  flashcard as starred or important

        const card = flashcard.cards.id(cardId);

        if(!card){
            return next(new ErrorHandler("Card not Found",404));
        }

        card.isStarred = !card.isStarred;

        await flashcard.save();

        res.status(200).json({
            success : true,
            message : "Star Status updated"
        })
    }
)