const Content = require("../models/Content");

// Public: fetch a page's saved content (may be empty -> frontend uses defaults).
const getContent = async (req, res) => {
  try {
    const doc = await Content.findOne({ page: req.params.page });
    res.json({ success: true, page: req.params.page, data: doc?.data || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: save/replace a page's content.
const updateContent = async (req, res) => {
  try {
    const { data } = req.body;
    const doc = await Content.findOneAndUpdate(
      { page: req.params.page },
      { $set: { data } },
      { new: true, upsert: true }
    );
    res.json({ success: true, page: doc.page, data: doc.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContent, updateContent };
