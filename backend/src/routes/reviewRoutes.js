const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviewsBySite,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);

router.get("/site/:siteId", getReviewsBySite);

module.exports = router;