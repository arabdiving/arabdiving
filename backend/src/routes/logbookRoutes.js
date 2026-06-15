const express = require("express");

const router = express.Router();

const {
  createLogbookEntry,
  getMyLogbook,
} = require(
  "../controllers/logbookController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/",
  protect,
  createLogbookEntry
);

router.get(
  "/my",
  protect,
  getMyLogbook
);

module.exports = router;