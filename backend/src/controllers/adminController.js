const bcrypt = require("bcryptjs");
const User = require("../models/User");
const DiveSite = require("../models/DiveSite");
const Review = require("../models/Review");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
    }
    if (!["member", "admin"].includes(req.body.role)) {
      return res.status(400).json({ success: false, message: "دور غير صالح" });
    }
    user.role = req.body.role;
    await user.save();
    res.json({ success: true, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "الاسم والبريد وكلمة المرور مطلوبة" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: "البريد مستخدم بالفعل" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role === "admin" ? "admin" : "member",
    });
    res.status(201).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "لا يمكنك حذف حسابك الخاص" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
    }
    res.json({ success: true, message: "تم حذف المستخدم" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [users, diveSites, reviews, posts, comments] = await Promise.all([
      User.countDocuments(),
      DiveSite.countDocuments(),
      Review.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
    ]);
    res.json({ success: true, stats: { users, diveSites, reviews, posts, comments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== Moderation =====
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name").sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminDeletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "المنشور غير موجود" });
    await Comment.deleteMany({ post: req.params.id });
    res.json({ success: true, message: "تم حذف المنشور" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminDeleteComment = async (req, res) => {
  try {
    const c = await Comment.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ success: false, message: "التعليق غير موجود" });
    res.json({ success: true, message: "تم حذف التعليق" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateUserRole,
  createUser,
  deleteUser,
  getUsers,
  getDashboardStats,
  getAllPosts,
  adminDeletePost,
  adminDeleteComment,
};
