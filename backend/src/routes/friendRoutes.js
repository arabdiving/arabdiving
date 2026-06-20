const express = require("express");
const router = express.Router();
const { sendRequest, acceptRequest, declineRequest, removeFriend, myFriends } = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, myFriends);
router.post("/request/:id", protect, sendRequest);
router.post("/accept/:id", protect, acceptRequest);
router.post("/decline/:id", protect, declineRequest);
router.post("/remove/:id", protect, removeFriend);

module.exports = router;
