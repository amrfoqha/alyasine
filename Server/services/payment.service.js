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

module.exports.updateCheckStatus = async (paymentId, newStatus) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.method !== "check") {
      throw new Error("Only check payments have a status");
    }

    const customer = await customerModel.findById(payment.customer);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const oldStatus = payment.checkDetails.status;
    if (oldStatus === newStatus) {
      return payment;
    }

    if (oldStatus === "cleared" && newStatus !== "cleared") {
      // Was cleared, now it's not -> add back to balance
      customer.balance += payment.amount;
    }

    payment.checkDetails.status = newStatus;

    await customer.save();
    await payment.save();

    await payment.populate("customer");
    return payment;
  } catch (error) {
    console.error("Update Check Status Error:", error);
    throw error;
  }
};

module.exports.deletePayment = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId, { isDeleted: false });
    if (!payment) {
      throw new Error("Payment not found");
    }

    const customer = await customerModel.findById(payment.customer);
    if (customer) {
      // If it was cash/bank OR a cleared check, we must add the amount back to balance
      if (
        payment.method !== "check" ||
        payment.checkDetails.status === "cleared"
      ) {
        customer.balance += payment.amount;
        await customer.save();
      }
    }

    // Soft delete or hard delete? The model has isDeleted but controller was using findByIdAndDelete
    // Let's stick to what was there but add the balance logic.
    // If the user wants soft delete, they should use isDeleted = true.
    await Payment.findByIdAndUpdate(paymentId, { isDeleted: true });
    return { message: "Payment deleted successfully" };
  } catch (error) {
    console.error("Delete Payment Error:", error);
    throw error;
  }
};
