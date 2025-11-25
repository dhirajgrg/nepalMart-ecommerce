const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const cartController = require("../controller/cartController");

router.use(authMiddleware.protect, authMiddleware.restrictTo("customer"));
router.post("/createCart", cartController.createCart);

module.exports = router;
