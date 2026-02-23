const FlashCard = require("../../models/flashcard.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");

exports.getMyAllFlashcards = catchAsyncError(
    async(req,res,next)=>{
        const userId = req.user._id;

        const allFlashcards = await FlashCard.find({userId, isDeleted:false}).populate("documentId","title").sort({creatdAt:-1});

        res.status(200).json({
            success : true,
            data : allFlashcards
        })
    }
)