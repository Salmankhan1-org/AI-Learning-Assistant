const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.getQuizById = catchAsyncError(
    async(req,res,next)=>{
        const {quizId} = req.params;
        const userId = req.user._id;

        if(!quizId){
            return next(new ErrorHandler("Please Provide Quiz Id",401));
        }

        const quiz = await Quiz.findOne({_id:quizId, userId, isDeleted:false}).populate("documentId","title");


        if(!quiz){
            return next(new ErrorHandler("Quiz not Found",404));
        }

        res.status(200).json({
            success : true,
            data : quiz
        })
        
    }
)