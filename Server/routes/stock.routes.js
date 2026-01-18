const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockin.controller");

router.post("/stockin", stockController.stockIn);
router.post("/stockout", stockController.stockOut);
router.get("/stockin", stockController.getAllStockIn);
router.get("/stockout", stockController.getAllStockOut);

module.exports = router;
