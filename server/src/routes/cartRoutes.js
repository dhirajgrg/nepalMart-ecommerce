const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const cartController = require("../controller/cartController");

router.post(
  "/addToCart",
  authMiddleware.protect,
  roleMiddleware.restrictTo("customer"),
  cartController.createCart
);
router.get(
  "/getCart",
  authMiddleware.protect,
  roleMiddleware.restrictTo("customer"),
  cartController.getCart
);
router.delete(
  "/deleteCart",
  authMiddleware.protect,
  roleMiddleware.restrictTo("customer"),
  cartController.deleteCart
);

module.exports = router;
