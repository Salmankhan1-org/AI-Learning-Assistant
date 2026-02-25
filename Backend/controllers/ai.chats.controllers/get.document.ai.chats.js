const Chat = require("../../models/chat.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const { GetDocumentId } = require("../../utils/Documents/get.document.id");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.getDocumentAiChats = catchAsyncError(
    async(req,res,next)=>{
        const documentId = GetDocumentId(req);
        const userId = GetUserId(req);

        const chats = await Chat.findOne({documentId, userId});

        res.status(200).json({
            success:true,
            data : chats
        });
    }
)