const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const cartController = require("../controller/cartController");

router.post(
  "/addToCart",
  authMiddleware.protect,
  authMiddleware.restrictTo("customer"),
  cartController.createCart
);
router.get(
  "/getCart",
  authMiddleware.protect,
  authMiddleware.restrictTo("customer"),
  cartController.getCart
);
router.delete(
  "/deleteCart",
  authMiddleware.protect,
  authMiddleware.restrictTo("customer"),
  cartController.deleteCart
);

module.exports = router;
