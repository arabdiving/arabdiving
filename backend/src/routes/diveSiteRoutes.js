const express = require("express");
const DiveSite = require("../models/DiveSite");

const {
  getDiveSites,
  createDiveSite,
} = require("../controllers/diveSiteController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getDiveSites);

// Creating dive sites is an admin-only action.
router.post("/", protect, adminOnly, createDiveSite);

router.get("/:id", async (req, res) => {
  try {
    const diveSite = await DiveSite.findById(req.params.id);

    if (!diveSite) {
      return res.status(404).json({
        success: false,
        message: "Dive site not found",
      });
    }

    res.json({
      success: true,
      diveSite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
