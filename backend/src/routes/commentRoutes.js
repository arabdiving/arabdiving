
const express = require("express");

const router = express.Router();
const {
  createComment,
  getCommentsByPost,
} = require(
  "../controllers/commentController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/",
  protect,
  createComment
);

router.get(
  "/post/:postId",
  getCommentsByPost
);

module.exports = router;