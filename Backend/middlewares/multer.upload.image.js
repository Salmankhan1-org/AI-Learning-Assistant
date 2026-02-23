// middlewares/uploadImage.js
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "MentorMind/users",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadImage = multer({ storage: imageStorage });

module.exports = uploadImage;
