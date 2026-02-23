const multer = require("multer");

const storage = multer.memoryStorage();

exports.uploadFiles = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});


