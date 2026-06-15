const mongoose = require("mongoose");

const DiveSiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    depth: {
      type: Number,
      default: 0,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    image: {
      type: String,
      default: "",
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DiveSite", DiveSiteSchema);