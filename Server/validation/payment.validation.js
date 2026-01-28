const Customer = require("../models/customer.model");
const Invoice = require("../models/invoices.model");

module.exports.validatePayment = async (req, res, next) => {
  try {
    const { customer, invoice, amount, method } = req.body;

    if (!customer)
      return res.status(400).json({ message: "Customer ID is required" });

    const customerDoc = await Customer.findById(customer);
    if (!customerDoc)
      return res.status(404).json({ message: "Customer not found" });

    if (invoice) {
      const invoiceDoc = await Invoice.findById(invoice);
      if (!invoiceDoc)
        return res.status(404).json({ message: "Invoice not found" });
    }

    if (amount === undefined || amount <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0" });

    if (!["cash", "bank", "check"].includes(method))
      return res.status(400).json({ message: "Invalid payment method" });

    if (method === "check") {
      const { checkDetails } = req.body;
      if (
        !checkDetails ||
        !checkDetails.checkNumber ||
        !checkDetails.bankName ||
        !checkDetails.dueDate
      ) {
        return res.status(400).json({
          message:
            "Check details (number, bank, due date) are required for check payments",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Payment Validation Error:", error);
    res.status(500).json({ message: "Server error during payment validation" });
  }
};
