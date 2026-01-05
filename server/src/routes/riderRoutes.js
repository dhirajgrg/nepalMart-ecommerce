const express = require("express");
const router = express.Router();
const riderController = require("../controller/riderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// middleware
router.use(authMiddleware.protect, roleMiddleware.restrictTo("rider"));


// routes
router.patch("/online", riderController.goOnline);
router.patch("/offline", riderController.goOffline);
router.get("/orders/current", riderController.getCurrentOrder);
router.patch("/orders/:orderId/accept", riderController.acceptOrder);
router.patch("/orders/:orderId/pickup", riderController.pickupOrder);
router.patch("/orders/:orderId/deliver", riderController.deliverOrder);

module.exports = router;
