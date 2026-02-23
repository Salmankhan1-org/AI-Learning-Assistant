const Document = require("../../models/document.schema");
const { catchAsyncError } = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.getSingleDocument = catchAsyncError(
    async(req,res,next)=>{
        const {documentId} = req.params;
        const userId = req.user._id;

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