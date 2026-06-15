const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  createUser,
  deleteUser,
  getAllPosts,
  adminDeletePost,
  adminDeleteComment,
  seedDiveSites,
} = require("../controllers/adminController");
const { uploadImage } = require("../controllers/uploadController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const DiveSite = require("../models/DiveSite");

// Everything here requires an authenticated admin.
router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getUsers);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);

// Image upload (returns Cloudinary URL)
router.post("/upload", upload.single("image"), uploadImage);

// Moderation
router.get("/posts", getAllPosts);
router.delete("/posts/:id", adminDeletePost);
router.delete("/comments/:id", adminDeleteComment);

// Dive sites management
router.post("/dive-sites/seed-defaults", seedDiveSites);

router.post("/dive-sites", async (req, res) => {
  try {
    const diveSite = await DiveSite.create(req.body);
    res.status(201).json({ success: true, diveSite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/dive-sites/:id", async (req, res) => {
  try {
    const diveSite = await DiveSite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!diveSite) return res.status(404).json({ success: false, message: "الموقع غير موجود" });
    res.json({ success: true, diveSite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/dive-sites/:id", async (req, res) => {
  try {
    const diveSite = await DiveSite.findByIdAndDelete(req.params.id);
    if (!diveSite) return res.status(404).json({ success: false, message: "الموقع غير موجود" });
    res.json({ success: true, message: "تم حذف الموقع" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
