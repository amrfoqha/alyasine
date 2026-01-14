const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");

router.post("/", paymentController.createPayment);
router.get("/", paymentController.findAllPayments);
router.get("/:id", paymentController.findPayment);
router.put("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
