const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controller/authController");

// public routes

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/logout",authMiddleware.protect, authController.logout);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);


module.exports=router;