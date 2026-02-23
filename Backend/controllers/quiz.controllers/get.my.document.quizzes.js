const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.getMyQuizzesOfDocument = catchAsyncError(
    async(req,res,next)=>{
        const {documentId} = req.params;
        const userId = req.user._id;

        if(!documentId){
            return next(new ErrorHandler("Please Provide Document Id",401));
        }

        // Find quizzes for the given document
        const quizzes = await Quiz.find({documentId, userId, isDeleted:false}).populate("documentId","title");

        res.status(200).json({
            success : true,
            data : quizzes
        })
    }
)