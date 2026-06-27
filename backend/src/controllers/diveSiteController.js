const DiveSite = require("../models/DiveSite");

const getDiveSites = async (req, res) => {
  try {
    const query = {};
    if (req.query.featured === "true") query.featuredOnHome = true;
    const sites = await DiveSite.find(query);
    res.json({ success: true, count: sites.length, data: sites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDiveSite = async (req, res) => {
  try {
    const site = await DiveSite.create(req.body);
    res.status(201).json({ success: true, data: site });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDiveSite = async (req, res) => {
  try {
    const site = await DiveSite.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!site) return res.status(404).json({ success: false, message: "الموقع غير موجود" });
    res.json({ success: true, data: site });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDiveSite = async (req, res) => {
  try {
    const site = await DiveSite.findByIdAndDelete(req.params.id);
    if (!site) return res.status(404).json({ success: false, message: "الموقع غير موجود" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleFeaturedDiveSite = async (req, res) => {
  try {
    const site = await DiveSite.findById(req.params.id);
    if (!site) return res.status(404).json({ success: false, message: "الموقع غير موجود" });
    site.featuredOnHome = !site.featuredOnHome;
    await site.save();
    res.json({ success: true, featuredOnHome: site.featuredOnHome });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDiveSites,
  createDiveSite,
  updateDiveSite,
  deleteDiveSite,
  toggleFeaturedDiveSite,
};