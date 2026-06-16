const express = require("express");
const router = express.Router();
const { createBooking, getBookingByCode, listBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.post("/", createBooking);
router.get("/admin", protect, adminOnly, listBookings);
router.get("/:code", getBookingByCode);

module.exports = router;
