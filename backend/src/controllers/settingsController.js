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
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled, hiddenPages: s.hiddenPages || [], whatsappNumber: s.whatsappNumber || "", chatEnabled: s.chatEnabled !== false, addons: s.addons || [], homeBlocks: s.homeBlocks || [] } });
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
    if (Array.isArray(req.body.addons)) {
      s.addons = req.body.addons
        .filter((a) => a && a.label)
        .map((a) => ({
          key: String(a.key || a.label).slice(0, 40),
          label: String(a.label).slice(0, 120),
          price: Number(a.price) || 0,
          perPerson: !!a.perPerson,
        }));
    }
    if (Array.isArray(req.body.homeBlocks)) {
      s.homeBlocks = req.body.homeBlocks.map((b, i) => ({
        key:     String(b.key || "").slice(0, 60),
        label:   String(b.label || "").slice(0, 120),
        visible: b.visible !== false,
        order:   typeof b.order === "number" ? b.order : i,
      }));
    }
    await s.save();
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled, hiddenPages: s.hiddenPages || [], whatsappNumber: s.whatsappNumber || "", chatEnabled: s.chatEnabled !== false, addons: s.addons || [], homeBlocks: s.homeBlocks || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { readSettings, updateSettings, getSettings };
