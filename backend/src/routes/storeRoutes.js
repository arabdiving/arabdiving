const express = require("express");
const router = express.Router();
const { getStoreBySlug, getMyCenter, getMyOrders, getMyProducts, createMyProduct, updateMyProduct, deleteMyProduct } = require("../controllers/storeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me/center", protect, getMyCenter);
router.get("/me/orders", protect, getMyOrders);
router.get("/me/products", protect, getMyProducts);
router.post("/me/products", protect, createMyProduct);
router.put("/me/products/:id", protect, updateMyProduct);
router.delete("/me/products/:id", protect, deleteMyProduct);
router.get("/:slug", getStoreBySlug);

module.exports = router;
