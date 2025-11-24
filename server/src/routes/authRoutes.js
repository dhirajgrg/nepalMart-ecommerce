const express = require("express");
const router = express.Router();

const usersController = require("../controller/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controller/authController");

// public routes
router.get("/", usersController.getAllUsers);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout",authMiddleware.protect, authController.logout);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);


module.exports=router;