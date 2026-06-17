const Booking = require("../models/Booking");
const ChildProfile = require("../models/ChildProfile");

// Public: create a booking (records as pending_payment; no real charge here).
const createBooking = async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.center && !b.centerName) {
      return res.status(400).json({ success: false, message: "بيانات المركز ناقصة." });
    }
    if (!b.contact || !b.contact.name || !b.contact.phone) {
      return res.status(400).json({ success: false, message: "الاسم ورقم الجوال مطلوبان." });
    }
    const booking = await Booking.create({
      center: b.center || undefined,
      centerName: b.centerName || "",
      date: b.date || "",
      peopleCount: Number(b.peopleCount) || 1,
      contact: b.contact,
      contactMethod: ['whatsapp','phone','email'].includes(b.contactMethod) ? b.contactMethod : 'whatsapp',
      bestCallTime: b.bestCallTime || '',
      passengers: Array.isArray(b.passengers) ? b.passengers : [],
      addons: Array.isArray(b.addons) ? b.addons : [],
      subtotal: Number(b.subtotal) || 0,
      total: Number(b.total) || 0,
      currency: b.currency || "$",
      user: req.user ? req.user._id : undefined,
    });

    // Persist child size profiles for the center (pre-prep gear).
    const kids = (booking.passengers || []).filter((p) => p.type === "child" && p.profile);
    for (const k of kids) {
      try {
        await ChildProfile.create({
          childName: k.name || "طفل",
          age: k.profile.age,
          gender: k.profile.gender,
          sizes: k.profile.sizes || {},
          pledge: !!k.profile.pledge,
          badgeTitle: k.profile.badgeTitle,
          centerName: booking.centerName,
          bookingRef: booking.ticketCode,
        });
      } catch (e) { /* non-fatal */ }
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: fetch a ticket by code (for confirmation page).
const getBookingByCode = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.code });
    if (!booking) return res.status(404).json({ success: false, message: "الحجز غير موجود" });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list bookings.
const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getBookingByCode, listBookings };
