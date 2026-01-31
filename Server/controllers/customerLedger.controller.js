const CustomerLedger = require("../models/customerLedger.model");

module.exports.getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;
    const ledger = await CustomerLedger.find({
      customer: customerId,
      isDeleted: false,
    }).sort({ createdAt: -1 });
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
