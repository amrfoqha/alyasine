const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoice.controller");

router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.findAllInvoices);
router.get("/:id", invoiceController.findInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
