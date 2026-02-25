const ActivityLogger = require("../../models/activity.logger.schema");
const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.deleteQuizUsingId = catchAsyncError(
    async(req,res,next)=>{
        const {quizId} = req.params;
        const userId = GetUserId(req);

        if(!quizId){
            return next(new ErrorHandler("Please provide quiz Id", 401));
        }

        // find the quiz
        const quiz = await Quiz.findOne({_id:quizId, userId, isDeleted:false}).populate("documentId","title");

        if(!quiz){
            return next(new ErrorHandler("Quiz not Found",401));
        }

        quiz.isDeleted = true;

        await quiz.save();

        await ActivityLogger.create({
            userId,
            title : `Quiz of ${quiz.documentId?.title} has been deleted`,
            type : "QUIZ_DELETED"
        });

        res.status(200).json({
            success : true,
            message : "Quiz Deleted Successfully"
        })
    }
)