const express = require("express");
const router = express.Router();

const productsController = require("../controller/productsController");
const authMiddleware = require("../middleware/authMiddleware");
const productsController = require("../controller/productsController");


//public products--------------------------
router.get("/products", productsController.getApprovedProducts);

// routes for VENDOR---------------------
router.use(authMiddleware.protect, authMiddleware.restrictTo("vendor"));

router.post("/createProduct", productsController.createProduct);
router.get("/myProducts", productsController.getMyAllProducts);

router
  .route("/:id")
  .get(productsController.getMyProduct)
  .patch(productsController.updateMyProduct)
  .delete(productsController.deleteMyProduct);

module.exports = router;
