const express = require("express");
const router = express.Router();
const { searchFlights, searchHotels, priceCalendar } = require("../controllers/travelController");

// أسعار حية (Travelpayouts + Amadeus) — عامة بدون توثيق، محمية بكاش داخلي
router.get("/flights", searchFlights);
router.get("/hotels", searchHotels);
router.get("/calendar", priceCalendar);

module.exports = router;
