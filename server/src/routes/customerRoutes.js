const express = require("express");
const router = express.Router();

const productsController = require("../controller/productsController");

// products
router.get("/products", productsController.getApprovedProducts);


module.exports = router;
