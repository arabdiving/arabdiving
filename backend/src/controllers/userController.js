const User = require("../models/User");
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
      "name bio country profileImage certificationLevel divesCount"
    );

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

   if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}

res.json({
  success: true,
  user: {
    ...user.toObject(),
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
  },
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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