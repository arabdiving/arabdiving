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

// Edit a comment — only its author (or an admin) may edit.
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "التعليق غير موجود" });
    }
    const isOwner = comment.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "غير مصرّح بتعديل هذا التعليق" });
    }
    const content = (req.body.content || "").trim();
    if (!content) {
      return res.status(400).json({ success: false, message: "نص التعليق مطلوب" });
    }
    comment.content = content;
    await comment.save();
    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createComment, getCommentsByPost, updateComment };
