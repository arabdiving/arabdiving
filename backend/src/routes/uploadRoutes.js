const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message:
            "تعذّر رفع الصورة. تأكد من إعداد مفاتيح Cloudinary على الخادم. (" +
            err.message + ")",
        });
      }
      next();
    });
  },
  uploadImage
);

module.exports = router;
