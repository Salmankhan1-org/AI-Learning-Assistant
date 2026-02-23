const Document = require("../../models/document.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const explainUsingAI = require("../../utils/explainUsingAI");
const { getContext } = require("../../utils/findContext");
const { generateUsingAI } = require("../../utils/gemini.ai");

// Future Scope : Instead of matching chunks, Store text embeddings along with chunks and match with prompt embedding using mongodb atlas vector search functionality for better chunks similarity and faster response

exports.explainConceptUsingAI = catchAsyncError(
  async (req, res, next) => {
    const { documentId } = req.params;
    const userId = req.user._id;
    const { prompt } = req.body;

    if (!documentId) {
      return next(new ErrorHandler("Please Provide Document Id", 401));
    }

    const document = await Document.findOne({
      _id: documentId,
      userId,
      isDeleted: false
    });

    if (!document) {
      return next(new ErrorHandler("Document not found", 404));
    }

    let context = getContext(document, prompt);

    const explanation = await explainUsingAI(prompt, context);

    res.status(200).json({
      success: true,
      message: `Explanation of "${prompt}"`,
      data: explanation
    });
  }
);

