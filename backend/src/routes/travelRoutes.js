const express = require("express");
const router = express.Router();
const { searchFlights, searchHotels } = require("../controllers/travelController");

// أسعار حية (Amadeus) — عامة بدون توثيق، محمية بكاش داخلي
router.get("/flights", searchFlights);
router.get("/hotels", searchHotels);

module.exports = router;
