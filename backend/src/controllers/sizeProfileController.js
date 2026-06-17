const SizeProfile = require("../models/SizeProfile");

// Get logged-in user's profile.
const getMyProfile = async (req, res) => {
  try {
    const profile = await SizeProfile.findOne({ user: req.user._id });
    res.json({ success: true, profile: profile || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create/update logged-in user's profile (upsert).
const saveMyProfile = async (req, res) => {
  try {
    const { group, sizes, womenExtras, notes } = req.body || {};
    const update = {
      user: req.user._id,
      name: req.user.name,
      group: group === "women" ? "women" : "men",
      sizes: sizes || {},
      womenExtras: womenExtras || {},
      notes: notes || "",
    };
    const profile = await SizeProfile.findOneAndUpdate(
      { user: req.user._id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list all profiles with the person's name.
const listProfiles = async (req, res) => {
  try {
    const profiles = await SizeProfile.find().populate("user", "name email").sort({ updatedAt: -1 }).limit(1000);
    res.json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyProfile, saveMyProfile, listProfiles };
