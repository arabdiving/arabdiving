const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const q = { active: true };
    if (req.query.category) q.category = req.query.category;
    const products = await Product.find(q).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    res.json({ success: true, product: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const createProduct = async (req, res) => {
  try { const p = await Product.create(req.body); res.status(201).json({ success: true, product: p }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    res.json({ success: true, product: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteProduct = async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
