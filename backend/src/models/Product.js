const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },     // مواصفات/خصائص كأسطر
    sizeType: { type: String, default: "none" },    // none | letters | numbers
    sizes: { type: [String], default: [] },          // ["M","L"] أو ["32","34"]
    inStock: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
