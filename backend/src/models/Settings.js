const mongoose = require("mongoose");

// Single global settings document (key: "site").
const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },
    commentsEnabled: { type: Boolean, default: true },
    hiddenPages: { type: [String], default: [] },
    whatsappNumber: { type: String, default: "" },
    chatEnabled: { type: Boolean, default: true },
    addons: {
      type: [{ key: String, label: String, price: Number, perPerson: Boolean }],
      default: [
        { key: "photographer", label: "مصوّر تحت الماء 📸 (لليوم)", price: 100, perPerson: false },
        { key: "lunch", label: "وجبة غداء على القارب 🍽️", price: 20, perPerson: true },
        { key: "privateBoat", label: "قارب خاص للعائلة 🛥️", price: 1000, perPerson: false },
        { key: "transport", label: "نقل من وإلى الفندق 🚐", price: 25, perPerson: false },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
