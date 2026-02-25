const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const { GetDocumentId } = require("../../utils/Documents/get.document.id");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.getMyQuizzesOfDocument = catchAsyncError(
    async(req,res,next)=>{
        const documentId = GetDocumentId(req);
        const userId = GetUserId(req);

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