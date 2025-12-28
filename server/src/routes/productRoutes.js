const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const productController = require("../controller/productController");

router.post(
  "/",
  authMiddleware.protect,
  roleMiddleware.restrictTo("vendor"),
  productController.createProduct
);
router.get(
  "/myProduct",
  authMiddleware.protect,
  roleMiddleware.restrictTo("vendor"),
  productController.myProduct
);
router.patch(
  "/:id",
  authMiddleware.protect,
  roleMiddleware.restrictTo("vendor"),
  productController.updateProduct
);
router.get(
  "/store/:storeId",
  authMiddleware.protect,
  productController.getProductsByStore
);

module.exports = router;
