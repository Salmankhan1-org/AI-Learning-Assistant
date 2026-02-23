const { uploadFiles } = require("./multer.upload.files");

exports.handleUpload = (req, res, next) => {
  uploadFiles.single("document")(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}