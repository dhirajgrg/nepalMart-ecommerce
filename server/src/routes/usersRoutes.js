const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const usersController = require("../controller/usersController");
const authMiddleware = require("../middleware/authMiddleware");

// public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authMiddleware.protect,
  authController.updatePassword
);

// protect route
router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin"),
  usersController.getAllUsers
);

router
  .route("/:id")
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    usersController.deleteUser
  );

module.exports = router;
