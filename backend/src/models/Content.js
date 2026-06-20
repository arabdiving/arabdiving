const mongoose = require("mongoose");

// Stores the editable content of a page as a flexible JSON document.
// page: "home" | "kids" | "women" | "youth" | "trips" ...
const ContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model("Content", ContentSchema);
