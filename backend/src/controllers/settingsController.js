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
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled, hiddenPages: s.hiddenPages || [], whatsappNumber: s.whatsappNumber || "", chatEnabled: s.chatEnabled !== false } });
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
    if (Array.isArray(req.body.hiddenPages)) {
      s.hiddenPages = req.body.hiddenPages.map((x) => String(x));
    }
    if (typeof req.body.whatsappNumber === "string") {
      s.whatsappNumber = req.body.whatsappNumber.trim();
    }
    if (typeof req.body.chatEnabled === "boolean") {
      s.chatEnabled = req.body.chatEnabled;
    }
    await s.save();
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled, hiddenPages: s.hiddenPages || [], whatsappNumber: s.whatsappNumber || "", chatEnabled: s.chatEnabled !== false } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { readSettings, updateSettings, getSettings };
