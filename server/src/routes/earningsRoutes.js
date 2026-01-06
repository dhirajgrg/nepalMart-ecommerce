const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const earningsController = require("../controller/earningsController");

router.get(
  "/vendor",
  authMiddleware.protect,
  authMiddleware.restrictTo("vendor"),
  earningsController.getVendorEarnings
);
router.get(
  "/rider",
  authMiddleware.protect,
  authMiddleware.restrictTo("rider"),
  earningsController.getRiderEarnings
);
router.get(
  "/admin",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin"),
  earningsController.getPlatformEarnings
);

module.exports = router;
