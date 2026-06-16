const mongoose = require("mongoose");

// Single global settings document (key: "site").
const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },
    commentsEnabled: { type: Boolean, default: true },
    hiddenPages: { type: [String], default: [] },
    whatsappNumber: { type: String, default: "" },
    chatEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
