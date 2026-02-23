const ActivityLogger = require("../../models/activity.logger.schema");
const Document = require("../../models/document.schema");
const Quiz = require("../../models/quiz.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const { generateUsingAI } = require("../../utils/gemini.ai");

exports.generateQuiz = catchAsyncError(
    async(req,res,next)=>{
        const {documentId} = req.params;
        const {questions} = req.body;
        const userId = req.user._id;
        
        if(!documentId) {
            return next(new ErrorHandler("Please Provide DocumentId", 401));
        }

        const document = await Document.findOne({_id:documentId, isDeleted:false});

        if(!document){
            return next(new ErrorHandler("Document not Found",404));
        }

        const quizQuestions = await generateQuizUsingAI(document.extractedText, questions); 

        const newQuiz = Quiz.create({
            documentId,
            userId,
            questions : quizQuestions,
            totalQuestions : questions
        });

        await ActivityLogger.create({
            userId,
            title : `A new Quiz of "${document.title}" has been Generated`,
            type : "QUIZ_GENERATED"
        });

        res.status(200).json({
            success: true,
            message : "Quiz has been created Successfully"
        });
    }
)

async function generateQuizUsingAI(text, numOfQuestions){
    let prompt = `You are an AI that generates quizzes strictly from the provided document text.

    DOCUMENT TEXT:
    """
    ${text}
    """

    TASK:
    Generate exactly ${numOfQuestions} multiple-choice questions based ONLY on the document text above.

    OUTPUT FORMAT:
    Return ONLY a valid JSON array.
    Do NOT include markdown.
    Do NOT include explanations outside JSON.
    Do NOT include trailing commas.

    Each item in the array must follow this schema:

    {
    "question": string,
    "options": string[],
    "correctAnswer": string,
    "explanation": string,
    "difficulty": "easy" | "medium" | "hard",
    }

    RULES:
    - Questions must be answerable using ONLY the provided document text
    - Each question must have exactly 4 options
    - The correctAnswer must be one of the options
    - Do NOT repeat questions
    - Do NOT invent information not present in the text
    - Vary difficulty across questions if possible
    - Avoid vague or opinion-based questions
    - Ensure options are clearly distinct

    BEGIN JSON OUTPUT:
    `

    const questions = await generateUsingAI(prompt);

    return questions;

}


