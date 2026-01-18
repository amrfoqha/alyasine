const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockin.controller");

router.post("/stockIn", stockController.stockIn);
router.post("/stockOut", stockController.stockOut);
router.get("/stockIn", stockController.getAllStockIn);
router.get("/stockOut", stockController.getAllStockOut);

module.exports = router;
