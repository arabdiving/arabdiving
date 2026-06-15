const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  updateComment,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createComment);
router.get("/post/:postId", getCommentsByPost);
router.put("/:id", protect, updateComment);

module.exports = router;
