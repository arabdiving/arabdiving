const User = require("../models/User");

function pvVisible(level, isSelf, isFriend) {
  if (isSelf) return true;
  if (!level || level === "public") return true;
  if (level === "friends") return isFriend;
  return false; // hidden
}
function sanitizeUser(u, viewer) {
  const o = u.toObject ? u.toObject() : u;
  const isSelf = viewer && viewer._id.toString() === o._id.toString();
  const isFriend = viewer && (o.friends || []).some((f) => f.toString() === viewer._id.toString());
  const photoOk = pvVisible(o.privacy && o.privacy.photo, isSelf, isFriend);
  const infoOk = pvVisible(o.privacy && o.privacy.info, isSelf, isFriend);
  const r = { _id: o._id, name: o.name, divesCount: o.divesCount, role: o.role };
  r.profileImage = photoOk ? (o.profileImage || "") : "";
  r.photoHidden = !photoOk;
  r.infoHidden = !infoOk;
  if (infoOk) { r.country = o.country || ""; r.city = o.city || ""; r.bio = o.bio || ""; r.certificationLevel = o.certificationLevel || ""; r.dateOfBirth = o.dateOfBirth || ""; }
  return r;
}
const bcrypt = require("bcryptjs");

// Get logged-in user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    const targetUser = await User.findById(
      req.params.id
    );

    const currentUser = await User.findById(
      req.user._id
    );

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      targetUser._id.toString() ===
      currentUser._id.toString()
    ) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const alreadyFollowing =
      currentUser.following.includes(
        targetUser._id
      );

    if (alreadyFollowing) {
      return res.status(400).json({
        message: "Already following",
      });
    }

    currentUser.following.push(
      targetUser._id
    );

    targetUser.followers.push(
      currentUser._id
    );

    await currentUser.save();
    await targetUser.save();

    res.json({
      success: true,
      followers:
        targetUser.followers.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const unfollowUser = async (req, res) => {
  try {
    const targetUser = await User.findById(
      req.params.id
    );

    const currentUser = await User.findById(
      req.user._id
    );

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    currentUser.following =
      currentUser.following.filter(
        (id) =>
          id.toString() !==
          targetUser._id.toString()
      );

    targetUser.followers =
      targetUser.followers.filter(
        (id) =>
          id.toString() !==
          currentUser._id.toString()
      );

    await currentUser.save();
    await targetUser.save();

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update logged-in user profile
const updateProfile = async (req, res) => {
  try {
    const {
      country,
      city,
      certificationLevel,
      divesCount,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.country = country || user.country;
    user.city = city || user.city;
    user.certificationLevel =
      certificationLevel || user.certificationLevel;
    user.divesCount =
      divesCount !== undefined
        ? divesCount
        : user.divesCount;

    if (typeof req.body.bio === "string") user.bio = req.body.bio.slice(0, 300);
    if (typeof req.body.dateOfBirth === "string") user.dateOfBirth = req.body.dateOfBirth;
    if (req.body.privacy) {
      user.privacy = user.privacy || {};
      const allowed = ["public", "friends", "hidden"];
      if (allowed.includes(req.body.privacy.photo)) user.privacy.photo = req.body.privacy.photo;
      if (allowed.includes(req.body.privacy.info)) user.privacy.info = req.body.privacy.info;
    }

    // Self-service password change (requires current password).
    if (req.body.newPassword) {
      const current = req.body.currentPassword || "";
      const match = await bcrypt.compare(current, user.password);
      if (!match) {
        return res.status(400).json({ success: false, message: "كلمة المرور الحالية غير صحيحة" });
      }
      if (String(req.body.newPassword).length < 6) {
        return res.status(400).json({ success: false, message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });
      }
      user.password = await bcrypt.hash(String(req.body.newPassword), 10);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const uploadProfileImage = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.file) {
  return res.status(400).json({
    message: "No image uploaded",
  });
}
    user.profileImage = req.file.path;

    await user.save();

    res.json({
      success: true,
      profileImage:
        user.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "name bio country city dateOfBirth profileImage certificationLevel divesCount privacy friends"
    );
    const out = users.map((u) => sanitizeUser(u, req.user));
    res.json({ success: true, users: out });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "العضو غير موجود" });
    const viewer = req.user;
    const o = sanitizeUser(user, viewer);
    let relation = "none";
    if (viewer) {
      const vid = viewer._id.toString();
      if (vid === user._id.toString()) relation = "self";
      else if ((user.friends || []).some((f) => f.toString() === vid)) relation = "friends";
      else if ((user.friendReqIn || []).some((f) => f.toString() === vid)) relation = "outgoing";
      else if ((user.friendReqOut || []).some((f) => f.toString() === vid)) relation = "incoming";
    }
    o.relation = relation;
    o.friendsCount = (user.friends || []).length;
    res.json({ success: true, user: o });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  uploadProfileImage,
  followUser,
  unfollowUser,
};