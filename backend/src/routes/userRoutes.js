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
  upload.single("image"),
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