const PartnerCenter = require("../models/PartnerCenter");
const Product = require("../models/Product");
const Booking = require("../models/Booking");

const findMyCenter = (userId) => PartnerCenter.findOne({ owner: userId });

// Public: store by slug + its active products.
const getStoreBySlug = async (req, res) => {
  try {
    const center = await PartnerCenter.findOne({ slug: req.params.slug, active: true });
    if (!center) return res.status(404).json({ success: false, message: "المتجر غير موجود" });
    const products = await Product.find({ center: center._id, active: true }).sort({ createdAt: -1 });
    res.json({ success: true, center, products });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyCenter = async (req, res) => {
  try { const center = await findMyCenter(req.user._id); res.json({ success: true, center: center || null }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyOrders = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.json({ success: true, orders: [], centerName: "" });
    const orders = await Booking.find({ center: center._id }).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, orders, centerName: center.name });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyProducts = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.json({ success: true, products: [] });
    const products = await Product.find({ center: center._id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const createMyProduct = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك متجرًا. تواصل مع الإدارة." });
    const p = await Product.create({ ...req.body, center: center._id });
    res.status(201).json({ success: true, product: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateMyProduct = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك متجرًا." });
    const p = await Product.findOne({ _id: req.params.id, center: center._id });
    if (!p) return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    const body = { ...req.body }; delete body.center;
    Object.assign(p, body);
    await p.save();
    res.json({ success: true, product: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteMyProduct = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك متجرًا." });
    await Product.deleteOne({ _id: req.params.id, center: center._id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getStoreBySlug, getMyCenter, getMyOrders, getMyProducts, createMyProduct, updateMyProduct, deleteMyProduct };
