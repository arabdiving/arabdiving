const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  listInstructors, getInstructor, getMyInstructorProfile, upsertMyInstructorProfile, saveFingerprint, saveFit,
  getMyCenters, requestJoinCenter, respondToCenter,
} = require("../controllers/instructorController");

router.get("/me", protect, getMyInstructorProfile);
router.put("/me", protect, upsertMyInstructorProfile);
router.put("/me/fingerprint", protect, saveFingerprint);
router.put("/me/fit", protect, saveFit);
router.get("/me/centers", protect, getMyCenters);
router.post("/me/centers/:centerId/request", protect, requestJoinCenter);
router.post("/me/centers/:centerId/respond", protect, respondToCenter);
router.get("/", listInstructors);
router.get("/:id", getInstructor);

module.exports = router;
