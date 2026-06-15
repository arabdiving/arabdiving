const express = require("express");
const router = express.Router();

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  uploadProfileImage,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

// Logged in user
router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

// Profile image
router.post(
  "/profile/image",
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
  uploadProfileImage
);

// Follow system
router.post(
  "/:id/follow",
  protect,
  followUser
);

router.post(
  "/:id/unfollow",
  protect,
  unfollowUser
);

// Members
router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;