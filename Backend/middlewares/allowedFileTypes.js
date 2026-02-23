const { catchAsyncError } = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

exports.allowedFileTypes = catchAsyncError(
    (req,res,next)=>{
        const allowedTypes = [
        "application/pdf"
        ];

        if (!allowedTypes.includes(req?.file.mimetype)) {
         return next(new ErrorHandler("Unsupported File Type",401));
        }

        next();

    }
)