const documentQueue = require("../../config/document.job.queue");
const Document = require("../../models/document.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const ActivityLogger = require("../../models/activity.logger.schema");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.uploadDocument = catchAsyncError(async (req, res, next) => {
  const userId = GetUserId(req);
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    return next(new ErrorHandler("Document title is required", 400));
  }


  if (!req.file) {
    return next(new ErrorHandler("Document file is required", 400));
  }


  const { originalname, size, mimetype, buffer } = req?.file;


  // Create document 
  const document = await Document.create({
    userId,
    title: title.trim(),
    file: {
      originalName: originalname,
      size: `${(size / 1024).toFixed(2)} KB`,
      mimeType: mimetype,
      url: "", 
    },
    extractedText: "",
    chunks: [],
    status: "processing",
  });


  await ActivityLogger.create({
    userId,
    title: `A new Document "${title}" has been Uploaded`,
    type: "DOCUMENT_UPLOADED",
  });

  // Push job with BUFFER
  await documentQueue.add("process-document", {
    documentId: document._id.toString(),
    buffer: buffer.toString("base64"), 
    mimetype,
  });

  res.status(201).json({
    success: true,
    message: "Document uploaded successfully. Processing started.",
  });
});
