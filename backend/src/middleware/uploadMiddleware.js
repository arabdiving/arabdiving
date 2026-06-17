const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "arabdiving-media",
    resource_type: "auto", // supports images AND videos
    allowed_formats: [
      "jpg", "jpeg", "png", "webp", "gif",
      "mp4", "mov", "webm", "m4v", "ogg",
    ],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // up to 100MB (videos)
});

module.exports = upload;
