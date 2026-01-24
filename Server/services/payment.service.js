const customerModel = require("../models/customer.model");
const Payment = require("../models/payment.model");
const { generateCode } = require("../utils/generateCode");

module.exports.createPayment = async (data) => {
  try {
    const paymentCode = await generateCode("payment", "PAY");
    const customer = await customerModel.findById(data.customer);
    if (!customer) {
      throw new Error("Customer not found");
    }
    if (!data.amount) {
      throw new Error("Amount is required");
    }
    if (data.amount < 0) {
      throw new Error("Amount must be positive");
    }

    customer.balance -= data.amount;
    await customer.save();

    const payment = await Payment.create({ ...data, code: paymentCode });
    await payment.populate("customer");

    return payment;
  } catch (error) {
    console.error("Create Payment Error:", error);
    throw error;
  }
};
