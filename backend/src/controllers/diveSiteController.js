const DiveSite = require("../models/DiveSite");

const getDiveSites = async (req, res) => {
  try {
    const sites = await DiveSite.find();

    res.json({
      success: true,
      count: sites.length,
      data: sites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createDiveSite = async (req, res) => {
  try {
    const site = await DiveSite.create(req.body);

    res.status(201).json({
      success: true,
      data: site,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDiveSites,
  createDiveSite,
};