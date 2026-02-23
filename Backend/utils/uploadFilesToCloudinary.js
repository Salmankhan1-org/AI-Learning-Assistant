const cloudinary = require("cloudinary").v2;

const uploadPDFBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",   
        folder: "MentorMind/documents",
        format: "pdf",
        access_mode: 'public'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

module.exports = { uploadPDFBuffer };
