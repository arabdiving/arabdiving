const express = require("express");
const router = express.Router();

const {
  createPost,
  updatePost,
  getPosts,
  getPostsByUser,
  likePost,
  deletePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.post("/", protect, createPost);
router.get("/user/:userId", getPostsByUser);
router.put("/:id/like", protect, likePost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
