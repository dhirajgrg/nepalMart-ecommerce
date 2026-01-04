const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const orderController = require("../controller/orderController");

// middleware
router.use(authMiddleware.protect, roleMiddleware.restrictTo("vendor"));


// routes
router.get("/orders", orderController.getOrderforVendor);
router.patch("/orders/:orderId/accept",orderController.acceptOrderByVendor)
router.patch("/orders/:orderId/reject",orderController.rejectOrderByVendor)
router.patch("/orders/:orderId/preparing",orderController.preparingOrderByVendor)
router.patch("/orders/:orderId/ready",orderController.readyForPickup)

module.exports = router;
