const mongoose = require("mongoose");

// Diver gear/size profile, linked to a user (one per user).
const SizeProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, sparse: true },
    name: { type: String, default: "" },
    group: { type: String, enum: ["men", "women"], default: "men" },
    sizes: {
      height: Number,  // cm
      weight: Number,  // kg
      shoe: Number,    // EU shoe (for fins)
      wetsuit: String, // XS..XXL
      mask: String,    // S/M/L
    },
    // Women-only modesty items
    womenExtras: {
      hoodie: String,     // size or ""
      swimCover: String,  // كاش مايوه — size or ""
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SizeProfile", SizeProfileSchema);
