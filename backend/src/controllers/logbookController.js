const Logbook = require("../models/Logbook");

const createLogbookEntry = async (
  req,
  res
) => {
  try {
    const entry =
      await Logbook.create({
        user: req.user._id,

        diveSite:
          req.body.diveSite,

        date: req.body.date,

        depth: req.body.depth,

        duration:
          req.body.duration,

        notes: req.body.notes,
      });

    res.status(201).json({
      success: true,
      entry,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyLogbook = async (
  req,
  res
) => {
  try {
    const entries =
      await Logbook.find({
        user: req.user._id,
      })
        .populate(
          "diveSite",
          "name country city"
        )
        .sort({
          date: -1,
        });

    res.json({
      success: true,
      count: entries.length,
      entries,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLogbookEntry,
  getMyLogbook,
};