const express = require("express");
const router = express.Router();
const {
  getCustomerLedger,
} = require("../controllers/customerLedger.controller");

router.get("/:customerId", getCustomerLedger);

module.exports = router;
