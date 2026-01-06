const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// ++++++++++++++++++ customer route +++++++++++++++++++++
router.post(
  "/createOrder",
  authMiddleware.protect,
  authMiddleware.restrictTo("customer"),
  orderController.createOrder
);

// +++++++++++++++++++++ vendor route +++++++++++++++++++++
router.get(
  "/getOrder",
  authMiddleware.protect,
  authMiddleware.restrictTo("vendor"),
  orderController.getOrdersForStore
);
module.exports = router;
