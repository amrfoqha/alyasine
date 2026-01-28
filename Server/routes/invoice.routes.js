const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoice.controller");
const { validateInvoice } = require("../validation/invoice.validation");

router.post("/", validateInvoice, invoiceController.createInvoice);
router.get("/", invoiceController.findAllInvoicesByPage);
router.get("/:id", invoiceController.findInvoice);
router.delete("/:id", invoiceController.deleteInvoice);
router.patch("/:id/status", invoiceController.updateCheckStatus);
router.get("/all", invoiceController.findAllInvoices);

module.exports = router;
