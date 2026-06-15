const Comment = require("../models/Comment");
const { getSettings } = require("./settingsController");

const createComment = async (req, res) => {
  try {
    const settings = await getSettings();
    if (!settings.commentsEnabled) {
      return res.status(403).json({ success: false, message: "التعليقات معطّلة حاليًا" });
    }
    const comment = await Comment.create({
      post: req.body.postId,
      user: req.user._id,
      content: req.body.content,
    });
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: comments.length, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createComment, getCommentsByPost };
