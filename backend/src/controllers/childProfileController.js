const ChildProfile = require("../models/ChildProfile");

// Public: save a child's size profile + pledge from the game.
const createChildProfile = async (req, res) => {
  try {
    const { childName, age, gender, sizes, gearEquipped, pledge, badgeTitle, centerName, bookingRef } = req.body;
    if (!childName || !String(childName).trim()) {
      return res.status(400).json({ success: false, message: "اسم الطفل مطلوب." });
    }
    const profile = await ChildProfile.create({
      childName: String(childName).trim(),
      age,
      gender: gender === "girl" ? "girl" : "boy",
      sizes: sizes || {},
      gearEquipped: Array.isArray(gearEquipped) ? gearEquipped : [],
      pledge: !!pledge,
      badgeTitle,
      centerName,
      bookingRef,
      user: req.user ? req.user._id : undefined,
    });
    res.status(201).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list collected profiles (newest first).
const listChildProfiles = async (req, res) => {
  try {
    const profiles = await ChildProfile.find().sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createChildProfile, listChildProfiles };
