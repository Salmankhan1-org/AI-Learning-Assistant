const ActivityLogger = require("../../models/activity.logger.schema");
const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");


exports.submitQuiz = catchAsyncError(
    async (req, res,next) => {
        const { quizId } = req.params;
        const { userAnswers } = req.body;
        const userId = GetUserId(req);

        if(!quizId){
            return next(new ErrorHandler("Please Provide quiz Id",401));
        }

        if (!Array.isArray(userAnswers)) {
        return next(new ErrorHandler("Invalid User Answer format",401));
        }

        const quiz = await Quiz.findOne({_id:quizId, userId, isDeleted:false}).populate("documentId","title");

        if (!quiz) {
        return next(new ErrorHandler("Quiz not found",404));
        }

        if (quiz.completedAt) {
        return next(new ErrorHandler("Quiz Already submitted",400));
        }

        let score = 0;

        // Check the correct answers and calculate the score
        const evaluatedAnswers = userAnswers.map((userAns) => {
        const { questionIndex, selectedAnswer } = userAns;

        const question = quiz.questions[questionIndex];

        if (!question) {
            throw new Error(`Invalid question index: ${questionIndex}`);
        }

        const isCorrect =
            selectedAnswer.trim() === question.correctAnswer.trim();

        if (isCorrect) score++;

        return {
            questionIndex,
            selectedAnswer,
            isCorrect,
            answeredAt: new Date()
        };
        });

        // Update quiz document
        quiz.userAnswers = evaluatedAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        await ActivityLogger.create({
            userId,
            title : `Quiz of ${quiz.documentId?.title} has been submitted`,
            type : "QUIZ_SUBMITTED"
        });

        return res.status(200).json({
        success: true,
        message: "Quiz submitted successfully",
        });
    }

)
