const express = require("express");
const router = express.Router();

const productsController = require("../controller/productsController");
const authMiddleware = require("../middleware/authMiddleware");

// middleware
router.use(authMiddleware.protect, authMiddleware.restrictTo("vendor"));

router.post("/createProduct", productsController.createProduct);
router.get("/myProducts", productsController.getMyAllProducts);

router
  .route("/:id")
  .get(productsController.getMyProduct)
  .patch(productsController.updateMyProduct)
  .delete(productsController.deleteMyProduct);

module.exports = router;
