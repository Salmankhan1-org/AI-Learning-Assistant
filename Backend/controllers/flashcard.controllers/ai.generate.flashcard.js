const ActivityLogger = require("../../models/activity.logger.schema");
const Document = require("../../models/document.schema");
const FlashCard = require("../../models/flashcard.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const { generateUsingAI } = require("../../utils/gemini.ai");

exports.generateFlashcards = catchAsyncError(
    async(req,res,next)=>{
        const {documentId} = req.params;
        const userId = req.user._id;

        if(!documentId){
            return next(new ErrorHandler("Document Id is required",401));
        }

        const document = await Document.findById(documentId);

        if(!document){
            return next(new ErrorHandler("Document not Found",404));
        }

        const flashcard = await generateFlashcardUsingAI(document.extractedText, 10);

        let newFlashcard = await FlashCard.create({
            documentId,
            userId,
            cards : flashcard
        })

        // Save the activity That new flashcard has been generated
        await ActivityLogger.create({
            userId,
            title : `A New Flashcard of ${document.title} has been created`,
            type : "FLASHCARD_CREATED"
        });

        res.status(200).json({
            success : true,
            message : "Flashcard has been Generated"
        })
    }
)


async function generateFlashcardUsingAI(text, numOfQuestions){
    let prompt = `You are an AI that generates study flashcards strictly from the provided document text.

    DOCUMENT TEXT:
    """
    ${text}
    """

    TASK:
    Generate exactly ${numOfQuestions} flashcards based ONLY on the document text above.

    OUTPUT FORMAT:
    Return ONLY a valid JSON array.
    Do NOT include markdown.
    Do NOT include explanations outside JSON.
    Do NOT include trailing commas.

    Each flashcard object must follow this schema:

    {
    "question": string,
    "answer": string,
    "difficulty": "easy" | "medium" | "hard"
    }

    RULES:
    - Use ONLY information present in the document text
    - Do NOT invent facts or examples
    - Each question must test an important concept or fact
    - Answers must be concise but complete
    - Avoid yes/no questions
    - Avoid vague or opinion-based questions
    - Do NOT repeat concepts
    - Vary difficulty if possible
    - If the text does not contain enough information, generate fewer flashcards rather than hallucinating

    BEGIN JSON OUTPUT:
 `

    const flashcard = await generateUsingAI(prompt);

    return flashcard;

}