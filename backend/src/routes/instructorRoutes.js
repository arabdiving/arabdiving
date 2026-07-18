const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  listInstructors, getInstructor, getMyInstructorProfile, upsertMyInstructorProfile, saveFingerprint, saveFit,
  getMyCenters, requestJoinCenter, respondToCenter,
  sendMessageToInstructor, getMyMessages, markMessageRead,
  adminListApplications, adminSetApplicationStatus,
} = require("../controllers/instructorController");

router.get("/admin/applications", protect, adminOnly, adminListApplications);
router.patch("/admin/applications/:id", protect, adminOnly, adminSetApplicationStatus);

router.get("/me", protect, getMyInstructorProfile);
router.put("/me", protect, upsertMyInstructorProfile);
router.put("/me/fingerprint", protect, saveFingerprint);
router.put("/me/fit", protect, saveFit);
router.get("/me/centers", protect, getMyCenters);
router.post("/me/centers/:centerId/request", protect, requestJoinCenter);
router.post("/me/centers/:centerId/respond", protect, respondToCenter);
router.get("/me/messages", protect, getMyMessages);
router.patch("/me/messages/:msgId/read", protect, markMessageRead);
router.get("/", listInstructors);
router.get("/:id", getInstructor);
router.post("/:id/message", sendMessageToInstructor);

module.exports = router;
