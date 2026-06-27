const mongoose = require("mongoose");

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
        { key: "photographer", label: "photographer", price: 100, perPerson: false },
        { key: "lunch",        label: "lunch",        price: 20,  perPerson: true  },
        { key: "privateBoat",  label: "privateBoat",  price: 1000,perPerson: false },
        { key: "transport",    label: "transport",    price: 25,  perPerson: false },
      ],
    },
    homeBlocks: {
      type: [
        {
          key:     { type: String },
          label:   { type: String },
          visible: { type: Boolean, default: true },
          order:   { type: Number,  default: 0 },
        },
      ],
      default: [
        { key: "hero",              label: "hero",              visible: true,  order: 0 },
        { key: "community_feed",    label: "community_feed",    visible: true,  order: 1 },
        { key: "gulf_focus",        label: "gulf_focus",        visible: true,  order: 2 },
        { key: "stats",             label: "stats",             visible: true,  order: 3 },
        { key: "segments",          label: "segments",          visible: true,  order: 4 },
        { key: "dive_centers",      label: "dive_centers",      visible: true,  order: 5 },
        { key: "featured_sites",    label: "featured_sites",    visible: true,  order: 6 },
        { key: "weight_calculator", label: "weight_calculator", visible: false, order: 7 },
        { key: "community_survey",  label: "community_survey",  visible: false, order: 8 },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
