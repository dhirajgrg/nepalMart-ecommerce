const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const usersController = require("../controller/usersController");
const authMiddleware = require("../middleware/authMiddleware");

// public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// protected routes
router.patch(
  "/updateMyPassword",
  authMiddleware.protect,
  usersController.updateMyPassword
);
router.patch("/updateMe", authMiddleware.protect, usersController.updateMe);
router.delete("/deleteMe", authMiddleware.protect, usersController.deleteMe);

// admin routes
router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin"),
  usersController.getAllUsers
);

router
  .route("/:id")
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    usersController.getUser
  )
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    usersController.updateUser
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    usersController.deleteUser
  );

module.exports = router;
