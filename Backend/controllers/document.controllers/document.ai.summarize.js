
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const Document = require("../../models/document.schema");
const { generateUsingAI } = require("../../utils/gemini.ai");

exports.generateSummaryOfDocument = catchAsyncError(
    async(req,res,next)=>{
        const {documentId} = req.params;
        const userId = req.user._id;

        if(!documentId){
            return next(new ErrorHandler("Please Provide Document Id", 401));
        }

        const document = await Document.findOne({_id:documentId, userId, isDeleted:false});

        if(!document){
            return next(new ErrorHandler("Document not found",404));
        }

        // Generate Summary of document extractec text

        const summary = await generateSummary( document.extractedText);

        res.status(200).json({
            success : true,
            message : "Document Summary Generated",
            data : summary
        });
    }
)

async function generateSummary( text){
    let prompt = `You are an expert academic and technical summarizer.
    Your task is to generate a highly informative, structured, and accurate summary of the document provided below.

    Follow these rules strictly:

    1. Do NOT add information that is not present in the document.
    2. Do NOT make assumptions.
    3. Preserve important terminology, names, dates, formulas, and definitions.
    4. Focus on key concepts, arguments, insights, and conclusions.
    5. Remove repetition and minor examples unless essential.
    6. If the document contains sections, summarize section-wise.
    7. Highlight critical definitions, frameworks, or processes clearly.

    Output Format:

    1. Title (if available)
    2. Overview (3–5 sentences giving the big picture)
    3. Key Points (bullet points of the most important ideas)
    4. Important Definitions / Concepts
    5. Processes / Methods (if any)
    6. Conclusions / Final Insights
    7. Any Data, Statistics, or Facts that are essential

    Make the summary concise but highly informative. 
    The reader should understand the full document without reading the original text.

    DOCUMENT:${text}
    `
    const summary = await generateUsingAI(prompt, false);

    return summary;
}

