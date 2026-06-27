const mongoose = require("mongoose");

// Accredited partner dive centers shown in the family booking flow.
// "badges" map directly to the SOP trust signals.
const PartnerCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, default: "مصر" },
    city: { type: String, default: "" }, // الغردقة / شرم الشيخ / دهب / مرسى علم ...
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },

    priceFrom: { type: Number, default: 0 },
    currency: { type: String, default: "$" },

    // Trust badges (SOP-aligned)
    badges: {
      womenStaff: { type: Boolean, default: false },        // 🧕 طاقم نسائي
      privateTrip: { type: Boolean, default: false },        // 🛥️ رحلة خاصة
      family: { type: Boolean, default: false },             // 👨‍👩‍👧‍👦 معتمد للعائلات
      separateFacilities: { type: Boolean, default: false }, // 🚿 مرافق مستقلة
      sanitizedGear: { type: Boolean, default: false },      // ✨ معدات معقّمة
      technical: { type: Boolean, default: false },          // ⚙️ غوص تقني
      ecoFriendly: { type: Boolean, default: false },        // 🪸 صديق للبيئة
    },

    whatsapp: { type: String, default: "" }, // for booking welcome message
    tier: { type: String, enum: ["silver", "gold", "platinum"], default: "silver" },
    active: { type: Boolean, default: true },
    featuredOnHome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerCenter", PartnerCenterSchema);
