const ActivityLogger = require("../../models/activity.logger.schema");
const Document = require("../../models/document.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const { GetDocumentId } = require("../../utils/Documents/get.document.id");
const ErrorHandler = require("../../utils/ErrorHandler");
const { GetUserId } = require("../../utils/Users/get.user.id");

exports.deleteDocumentById = catchAsyncError(
    async(req,res,next)=>{
        const documentId = GetDocumentId(req);
        const userId = GetUserId(req);


        let document = await Document.findById(documentId);

        if(!document){
            return next(new ErrorHandler("Document not Found",404));
        }

        document.isDeleted = true;

        await document.save();

        await ActivityLogger.create({
            userId,
            title : `A  Document "${document.title}" has been Deleted`,
            type : "DOCUMENT_DELETED"
        });

        res.status(200).json({
            success: true,
            message : "Document has been Deleted Successfully"
        })
    }
)