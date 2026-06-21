const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    type: { type: String, enum: ["adult", "child"], default: "adult" },
    // size profile (children) collected from the game
    profile: {
      age: Number,
      gender: String,
      sizes: {
        height: Number, weight: Number, shoe: Number, mask: String, wetsuit: String,
      },
      pledge: Boolean,
      badgeTitle: String,
    },
  },
  { _id: false }
);

const AddonSchema = new mongoose.Schema(
  { key: String, label: String, price: Number, perPerson: Boolean },
  { _id: false }
);

function makeCode() {
  const s = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += s[Math.floor(Math.random() * s.length)];
  return `AD-${c}`;
}

const BookingSchema = new mongoose.Schema(
  {
    center: { type: mongoose.Schema.Types.ObjectId, ref: "PartnerCenter" },
    centerName: { type: String, default: "" },
    date: { type: String, default: "" },
    peopleCount: { type: Number, default: 1 },
    contact: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    contactMethod: { type: String, enum: ["whatsapp", "phone", "email"], default: "whatsapp" },
    bestCallTime: { type: String, default: "" },
    passengers: [PassengerSchema],
    addons: [AddonSchema],
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "$" },
    displayCurrency: { type: String, default: "" },
    displayTotal: { type: Number, default: 0 },
    status: { type: String, enum: ["pending_confirmation", "pending_payment", "confirmed", "cancelled"], default: "pending_confirmation" },
    ticketCode: { type: String, unique: true, default: makeCode },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
