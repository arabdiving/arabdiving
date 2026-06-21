const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
profileImage: {
  type: String,
  default: "",
},
bio: {
  type: String,
  default: "",
  maxlength: 300,
},
    password: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    certificationLevel: {
      type: String,
      default: "Open Water",
    },

    divesCount: {
      type: Number,
      default: 0,
    },
    followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

following: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
    

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendReqIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendReqOut: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    privacy: {
      photo: { type: String, enum: ["public", "friends", "hidden"], default: "public" },
      info: { type: String, enum: ["public", "friends", "hidden"], default: "public" },
    },
    personality: {
      role: { type: String, default: "" },
      dominant: { type: String, default: "" },
      scores: {
        red: Number, yellow: Number, green: Number, blue: Number,
      },
      takenAt: Date,
    },

    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);