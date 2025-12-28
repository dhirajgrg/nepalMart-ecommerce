const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const usersController = require("../controller/usersController");

router.get("/me", authMiddleware.protect, usersController.getMe);



module.exports = router;