const Chat = require("../../models/chat.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.getDocumentAiChats = catchAsyncError(
    async(req,res,next)=>{
        const {documentId} = req.params;
        const userId = req.user._id;

        if(!documentId){
            return next(new ErrorHandler("Please Provide Document Id",401));
        }

        const chats = await Chat.findOne({documentId, userId});

        res.status(200).json({
            success:true,
            data : chats
        });
    }
)