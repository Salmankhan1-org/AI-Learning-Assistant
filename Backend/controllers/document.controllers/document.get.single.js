const Document = require("../../models/document.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const { GetDocumentId } = require("../../utils/Documents/get.document.id");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.getSingleDocument = catchAsyncError(
    async(req,res,next)=>{
        const documentId = GetDocumentId(req);
        const userId = GetUserId(req);

        const document = await Document.findOne(
            {_id : documentId, userId, isDeleted : false}
        );

        if(!document){
            return next(new ErrorHandler("Document not Found",404));
        }

        res.status(200).json({
            success: true,
            data : document
        })
    }
)