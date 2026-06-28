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
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled, hiddenPages: s.hiddenPages || [], whatsappNumber: s.whatsappNumber || "", chatEnabled: s.chatEnabled !== false, addons: s.addons || [], homeBlocks: s.homeBlocks || [], navStyle: s.navStyle || "buttons", homeCards: s.homeCards || [], theme: s.theme || {}, dayNight: s.dayNight || { enabled: false }, navGroups: s.navGroups || [] } });
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
    if (["buttons", "dropdown", "sidebar"].includes(req.body.navStyle)) {
      s.navStyle = req.body.navStyle;
    }
    if (Array.isArray(req.body.navGroups)) {
      s.navGroups = req.body.navGroups
        .filter((g) => g && g.label)
        .map((g) => ({
          label: String(g.label).slice(0, 60),
          items: (Array.isArray(g.items) ? g.items : [])
            .filter((it) => it && it.href)
            .map((it) => ({ href: String(it.href).slice(0, 120), label: String(it.label || "").slice(0, 60) })),
        }));
    }
    const THEME_KEYS = ["navy", "mid", "gold", "background", "surface", "text", "muted", "border", "hero"];
    const okColor = (v) => typeof v === "string" && /^#?[0-9a-zA-Z(),.%\s]{3,40}$/.test(v);
    if (req.body.theme && typeof req.body.theme === "object") {
      s.theme = s.theme || {};
      THEME_KEYS.forEach((k) => { if (okColor(req.body.theme[k])) s.theme[k] = req.body.theme[k]; });
      s.markModified("theme");
    }
    if (req.body.dayNight && typeof req.body.dayNight === "object") {
      s.dayNight = s.dayNight || {};
      if (typeof req.body.dayNight.enabled === "boolean") s.dayNight.enabled = req.body.dayNight.enabled;
      const clean = (obj) => {
        if (!obj || typeof obj !== "object") return undefined;
        const o = {}; THEME_KEYS.forEach((k) => { if (okColor(obj[k])) o[k] = obj[k]; }); return o;
      };
      if (req.body.dayNight.day) s.dayNight.day = clean(req.body.dayNight.day);
      if (req.body.dayNight.night) s.dayNight.night = clean(req.body.dayNight.night);
      s.markModified("dayNight");
    }
    if (Array.isArray(req.body.homeCards)) {
      s.homeCards = req.body.homeCards
        .filter((c) => c && c.href && c.label)
        .map((c) => ({
          href: String(c.href).slice(0, 120),
          label: String(c.label).slice(0, 80),
          desc: String(c.desc || "").slice(0, 160),
          icon: String(c.icon || "").slice(0, 8),
        }));
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
    res.json({ success: true, settings: { commentsEnabled: s.commentsEnabled, hiddenPages: s.hiddenPages || [], whatsappNumber: s.whatsappNumber || "", chatEnabled: s.chatEnabled !== false, addons: s.addons || [], homeBlocks: s.homeBlocks || [], navStyle: s.navStyle || "buttons", homeCards: s.homeCards || [], theme: s.theme || {}, dayNight: s.dayNight || { enabled: false }, navGroups: s.navGroups || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { readSettings, updateSettings, getSettings };
