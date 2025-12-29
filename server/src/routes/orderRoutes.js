const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ++++++++++++++++++ customer route +++++++++++++++++++++
router.post(
  "/createOrder",
  authMiddleware.protect,
  roleMiddleware.restrictTo("customer"),
  orderController.createOrder
);

// +++++++++++++++++++++ vendor route +++++++++++++++++++++
router.get(
  "/getOrder",
  authMiddleware.protect,
  roleMiddleware.restrictTo("vendor"),
  orderController.getOrdersForStore
);
module.exports = router;
