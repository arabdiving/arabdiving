const User = require("../models/User");
const DiveSite = require("../models/DiveSite");
const Logbook = require("../models/Logbook");

// Public, lightweight site-wide stats for the homepage.
const getPublicStats = async (req, res) => {
  try {
    const [members, diveSites, dives, countries] = await Promise.all([
      User.countDocuments(),
      DiveSite.countDocuments(),
      Logbook.countDocuments(),
      User.distinct("country", { country: { $nin: ["", null] } }),
    ]);

    res.json({
      success: true,
      stats: {
        members,
        diveSites,
        countries: countries.length,
        dives,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPublicStats };
