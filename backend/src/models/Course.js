const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    level: { type: String, default: "open_water" }, // try|open_water|advanced|rescue|divemaster|specialty|freediving|kids
    agency: { type: String, default: "PADI" },       // PADI|SSI|CMAS
    price: { type: Number, default: 0 },
    currency: { type: String, default: "SAR" },
    duration: { type: String, default: "" },
    description: { type: String, default: "" },
    includes: { type: [String], default: [] },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Course", CourseSchema);
