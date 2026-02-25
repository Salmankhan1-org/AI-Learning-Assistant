const Document = require("../../models/document.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const { GetDocumentId } = require("../../utils/Documents/get.document.id");
const ErrorHandler = require("../../utils/ErrorHandler");
const explainUsingAI = require("../../utils/AI/explainUsingAI");
const { getContext } = require("../../utils/AI/findContext");
const { generateUsingAI } = require("../../utils/AI/gemini.ai");
const { GetUserId } = require("../../utils/Users/get.user.id");

// Future Scope : Instead of matching chunks, Store text embeddings along with chunks and match with prompt embedding using mongodb atlas vector search functionality for better chunks similarity and faster response

exports.explainConceptUsingAI = catchAsyncError(
  async (req, res, next) => {
    const { prompt } = req.body;

    const documentId = GetDocumentId(req);
    const userId = GetUserId(req);

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

