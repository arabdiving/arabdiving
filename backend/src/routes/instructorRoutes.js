const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  listInstructors, getInstructor, getMyInstructorProfile, upsertMyInstructorProfile, saveFingerprint, saveFit,
} = require("../controllers/instructorController");

router.get("/me", protect, getMyInstructorProfile);
router.put("/me", protect, upsertMyInstructorProfile);
router.put("/me/fingerprint", protect, saveFingerprint);
router.put("/me/fit", protect, saveFit);
router.get("/", listInstructors);
router.get("/:id", getInstructor);

module.exports = router;
