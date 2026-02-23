const Chat = require("../../models/chat.schema");
const Document = require("../../models/document.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");
const explainUsingAI = require("../../utils/explainUsingAI");
const { getContext } = require("../../utils/findContext");
const { generateUsingAI } = require("../../utils/gemini.ai");

exports.aiChat = catchAsyncError(async (req, res, next) => {
  const { documentId } = req.params;
  const userId = req.user._id;
  const { prompt } = req.body;


  if (!documentId) {
    return next(new ErrorHandler("Please provide document Id", 400));
  }

  if (!prompt || prompt.trim() === "") {
    return next(new ErrorHandler("Question is required", 400));
  }

  const document = await Document.findOne({
    _id: documentId,
    userId,
    isDeleted: false,
  });

  if (!document) {
    return next(new ErrorHandler("Document Not Found", 404));
  }

  // Find existing chat
  let chat = await Chat.findOne({ documentId, userId });

  // Get relevant context 
  const context = await getContext(document, prompt);

  //  If chat exists → include history
  let conversationHistory = [];

  if (chat) {
    conversationHistory = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  // Generate AI answer
  const answer = await explainUsingAI(prompt, context);


  //  Save chat

  if (chat) {
    // Append new messages
    chat.messages.push(
      { role: "user", content: prompt },
      { role: "assistant", content: answer }
    );

    await chat.save();
  } else {
    // Create new conversation
    chat = await Chat.create({
      documentId,
      userId,
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: answer },
      ],
    });
  }

  res.status(200).json({
    success: true,
    message: "AI response generated successfully",
    data: {
      answer,
      chatId: chat._id,
    },
  });
});

