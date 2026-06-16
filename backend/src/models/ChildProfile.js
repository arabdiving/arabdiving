const mongoose = require("mongoose");

// Size + pledge profile collected via the "أبطال البحر الأحمر" kids game.
// Sent to the partner center ahead of arrival to pre-prepare gear.
const ChildProfileSchema = new mongoose.Schema(
  {
    childName: { type: String, required: true, trim: true },
    age: { type: Number, min: 2, max: 16 },
    gender: { type: String, enum: ["boy", "girl"], default: "boy" },
    sizes: {
      height: { type: Number }, // cm
      weight: { type: Number }, // kg
      shoe: { type: Number },   // EU shoe size (for fins)
      mask: { type: String },   // S / M / L
      wetsuit: { type: String },
    },
    gearEquipped: [{ type: String }],
    pledge: { type: Boolean, default: false },
    badgeTitle: { type: String },
    centerName: { type: String },
    bookingRef: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChildProfile", ChildProfileSchema);
