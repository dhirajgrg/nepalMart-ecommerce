const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controller/adminController");
const userController = require("../controller/usersController");
const productController = require("../controller/productsController");

// +++++++++++++++ ADMIN MIDDLEWARE ++++++++++++++
router.use(authMiddleware.protect, authMiddleware.restrictTo("admin"));

//++++++++++++++++++ USERS ROUTES ++++++++++++++++++++++++++++
router.get("/users", userController.getAllUsers);
router
  .route("/users/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  //++++++++++++++++APPROVED USER++++++++++++++++++
  //++++++++++++++++REJECTED USER++++++++++++++++++


//++++++++++++++ PRODUCTS ROUTES ++++++++++++++++++++++++++++
//APPROVED OR REJECT products
router.patch("/products/:id/approve", adminController.approvedProducts);
router.patch("/products/:id/reject", adminController.rejectedProducts);

//+++++++++++++ APPROVED PRODUCTS +++++++++
router.get(
  "/products/getApprovedProducts",
  productController.getApprovedProducts
);

//++++++++++++++ REJECTED PRODUCTS +++++++++
router.get(
  "/products/getRejectedProducts",
  productController.getRejectedProducts
);


//+++++++++++++++ GET ALL PRODUCTS +++++++++++++
router.get("/products", adminController.getAllProducts);

//++++++++++++++++ GET,DELETE,UPDATE +++++++++++++++++
router
  .route("/products/:id")
  .get(productController.getMyProduct)
  .patch(productController.updateMyProduct)
  .delete(productController.deleteMyProduct);

module.exports = router;
