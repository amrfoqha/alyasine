const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const { validatePayment } = require("../validation/payment.validation");

router.post("/", validatePayment, paymentController.createPayment);
router.get("/", paymentController.findAllPayments);
router.get("/:id", paymentController.findPayment);
router.put("/:id", validatePayment, paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);
router.patch("/:id/status", paymentController.updateCheckStatus);

module.exports = router;
