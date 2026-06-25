const mongoose = require("mongoose");

const LinkPreviewSchema = new mongoose.Schema({
  url:         { type: String, default: "" },
  title:       { type: String, default: "" },
  description: { type: String, default: "" },
  image:       { type: String, default: "" },
  siteName:    { type: String, default: "" },
}, { _id: false });

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    image: { type: String, default: "" },
    video: { type: String, default: "" },
    linkPreview: { type: LinkPreviewSchema, default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
