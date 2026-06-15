const Settings = require("../models/Settings");

const getSettings = async () => {
  let s = await Settings.findOne({ key: "site" });
  if (!s) s = await Settings.create({ key: "site" });
  return s;
};

// Public: read settings (e.g. commentsEnabled).
const readSettings = async (req, res) => {
  try {
    const s = await getSettings();
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update settings.
const updateSettings = async (req, res) => {
  try {
    const s = await getSettings();
    if (typeof req.body.commentsEnabled === "boolean") {
      s.commentsEnabled = req.body.commentsEnabled;
    }
    await s.save();
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { readSettings, updateSettings, getSettings };
