const express = require("express");
const router = express.Router();
const storeController = require("../controller/storeController");
const authMiddleware = require("../middleware/authMiddleware");

// ++++++++++++++++ ONLY FOR VENDOR ROUTES +++++++++++++++++++
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("vendor"),
  storeController.createStore
);

router.get(
  "/myStore",
  authMiddleware.protect,
  authMiddleware.restrictTo("vendor"),
  storeController.myStore
);
router.patch(
  "/open",
  authMiddleware.protect,
  authMiddleware.restrictTo("vendor"),
  storeController.openStore
);

// ++++++++++++++++ PUBLIC ROUTES(CUSTOMER) +++++++++++++++++++
router.get("/", authMiddleware.protect, storeController.storesList);

// ++++++++++++++++ ADMIN ROUTES +++++++++++++++++++
router.patch(
  "/:storeId/commission",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin"),
  storeController.commissionRate
);

module.exports = router;
