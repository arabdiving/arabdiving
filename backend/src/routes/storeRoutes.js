const express = require("express");
const router = express.Router();
const {
  getStoreBySlug, getMyCenter, getMyOrders, getMyProducts, createMyProduct, updateMyProduct, deleteMyProduct,
  getCourseTemplates, getMyCourses, addMyCourseFromTemplate, updateMyCourse, deleteMyCourse, setMyFeatured,
  updateMyCenter, getMyTeam, inviteInstructor, respondToInstructor,
} = require("../controllers/storeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me/center", protect, getMyCenter);
router.put("/me/center", protect, updateMyCenter);
router.get("/me/team", protect, getMyTeam);
router.post("/me/team/invite", protect, inviteInstructor);
router.post("/me/team/:instructorId/respond", protect, respondToInstructor);
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
router.put("/me/featured", protect, setMyFeatured);
router.get("/:slug", getStoreBySlug);

module.exports = router;
