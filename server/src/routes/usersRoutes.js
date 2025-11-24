const express = require("express");
const router = express.Router();

const usersController = require("../controller/usersController");
const authMiddleware = require("../middleware/authMiddleware");

// for profile related routes
router.use(authMiddleware.protect);
router.get("/getMe", usersController.getMe);
router.patch("/updateMyPassword", usersController.updateMyPassword);
router.patch("/updateMe", usersController.updateMe);
router.delete("/deleteMe", usersController.deleteMe);

module.exports = router;
