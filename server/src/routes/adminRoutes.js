const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controller/adminController");

// Protect all routes for admin
router.use(authMiddleware.protect, authMiddleware.restrictTo("admin"));

// Admin product routes
router.get("/products/", adminController.getAllProducts);
router.patch("/products/:id/approve", adminController.approvedProducts);
router.patch("/products/:id/reject", adminController.rejectedProducts);

module.exports = router;
