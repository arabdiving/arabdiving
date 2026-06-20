const Review = require("../models/Review");
const DiveSite = require("../models/DiveSite");
const { getSettings } = require("./settingsController");

const createReview = async (req, res) => {
  try {
    const settings = await getSettings();
    if (!settings.commentsEnabled) {
      return res.status(403).json({ success: false, message: "التعليقات والتقييمات معطّلة حاليًا" });
    }
    const { diveSiteId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      diveSite: diveSiteId,
      rating,
      comment,
    });

    // Recalculate the site's average rating.
    const reviews = await Review.find({ diveSite: diveSiteId });
    const reviewsCount = reviews.length;
    const averageRating =
      reviewsCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
        : 0;

    await DiveSite.findByIdAndUpdate(diveSiteId, {
      averageRating,
      reviewsCount,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReviewsBySite = async (req, res) => {
  try {
    const reviews = await Review.find({
      diveSite: req.params.siteId,
    }).populate("user", "name");

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getReviewsBySite,
};
