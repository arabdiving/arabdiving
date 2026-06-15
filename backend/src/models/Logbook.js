const mongoose = require("mongoose");

const LogbookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    diveSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiveSite",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    depth: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Logbook",
  LogbookSchema
);