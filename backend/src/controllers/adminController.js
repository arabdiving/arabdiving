const bcrypt = require("bcryptjs");
const User = require("../models/User");
const DiveSite = require("../models/DiveSite");
const Review = require("../models/Review");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const diveSitesData = require("../data/diveSites");

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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    res.json({ success: true, count: users.length, total, page, pages: Math.ceil(total / limit), users });
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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find().populate("user", "name").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);
    res.json({ success: true, count: posts.length, total, page, pages: Math.ceil(total / limit), posts });
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

// Bulk-import the default Egyptian Red Sea dive sites (idempotent upsert).
const seedDiveSites = async (req, res) => {
  try {
    let created = 0;
    let updated = 0;
    for (const site of diveSitesData) {
      const r = await DiveSite.updateOne({ name: site.name }, { $set: site }, { upsert: true });
      if (r.upsertedCount) created += 1;
      else if (r.matchedCount) updated += 1;
    }
    res.json({ success: true, created, updated, total: diveSitesData.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminUpdateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
    const { name, email, role, password, country, city } = req.body;
    if (typeof name === "string" && name.trim()) user.name = name.trim();
    if (typeof email === "string" && email.trim()) user.email = email.trim().toLowerCase();
    if (typeof country === "string") user.country = country;
    if (typeof city === "string") user.city = city;
    if (role && ["member", "admin"].includes(role)) user.role = role;
    if (password && String(password).length >= 6) {
      user.password = await bcrypt.hash(String(password), 10);
    }
    await user.save();
    res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateUserRole,
  adminUpdateUser,
  createUser,
  deleteUser,
  getUsers,
  getDashboardStats,
  getAllPosts,
  adminDeletePost,
  adminDeleteComment,
  seedDiveSites,
};
