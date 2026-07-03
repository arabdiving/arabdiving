const express = require("express");
const router = express.Router();
const {
  getStoreBySlug, getMyCenter, getMyOrders, getMyProducts, createMyProduct, updateMyProduct, deleteMyProduct,
  getCourseTemplates, getMyCourses, addMyCourseFromTemplate, updateMyCourse, deleteMyCourse,
} = require("../controllers/storeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me/center", protect, getMyCenter);
router.get("/me/orders", protect, getMyOrders);
router.get("/me/products", protect, getMyProducts);
router.post("/me/products", protect, createMyProduct);
router.put("/me/products/:id", protect, updateMyProduct);
router.delete("/me/products/:id", protect, deleteMyProduct);
router.get("/me/course-templates", protect, getCourseTemplates);
router.get("/me/courses", protect, getMyCourses);
router.post("/me/courses", protect, addMyCourseFromTemplate);
router.put("/me/courses/:id", protect, updateMyCourse);
router.delete("/me/courses/:id", protect, deleteMyCourse);
router.get("/:slug", getStoreBySlug);

module.exports = router;
