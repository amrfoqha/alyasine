const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Payment = require("../models/payment.model");
const { generateCode } = require("../utils/generateCode");
const { addLedgerEntry } = require("./ledger.service");

module.exports.createPayment = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const paymentCode = await generateCode("payment", "PAY", session);

    const customer = await Customer.findById(data.customer).session(session);
    if (!customer) throw new Error("Customer not found");

    customer.balance -= data.amount;
    await customer.save({ session });

    const [payment] = await Payment.create([{ ...data, code: paymentCode }], {
      session,
    });

    await addLedgerEntry({
      customer: customer._id,
      type: "payment",
      refId: payment._id,
      debit: 0,
      credit: data.amount,
      balanceAfter: customer.balance,
      description: "دفعة رقم " + paymentCode,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    await payment.populate("customer");
    return payment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports.updateCheckStatus = async (paymentId, newStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const payment = await Payment.findById(paymentId).session(session);
    if (!payment) throw new Error("Payment not found");

    const customer = await Customer.findById(payment.customer).session(session);
    const oldStatus = payment.checkDetails.status;

    if (oldStatus === newStatus) {
      await session.abortTransaction();
      session.endSession();
      return payment;
    }

    if (oldStatus === "pending" && newStatus === "returned") {
      customer.balance += payment.amount;

      await addLedgerEntry({
        customer: customer._id,
        type: "check_return",
        refId: payment._id,
        debit: payment.amount,
        credit: 0,
        balanceAfter: customer.balance,
        description: "شيك راجع دفعة " + payment.code,
        session,
      });
    } else if (
      oldStatus === "returned" &&
      (newStatus === "cleared" || newStatus === "pending")
    ) {
      // Re-deduct if it was returned and now recovered
      customer.balance -= payment.amount;
      await addLedgerEntry({
        customer: customer._id,
        type: "payment",
        refId: payment._id,
        debit: 0,
        credit: payment.amount,
        balanceAfter: customer.balance,
        description: "تحصيل شيك سابق (راجع) رقم " + payment.code,
        session,
      });
    }

    payment.checkDetails.status = newStatus;
    await customer.save({ session });
    await payment.save({ session });

    await session.commitTransaction();
    session.endSession();
    return payment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports.deletePayment = async (paymentId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const payment = await Payment.findById(paymentId).session(session);
    if (!payment) throw new Error("Payment not found");
    if (payment.isDeleted) throw new Error("Payment already deleted");

    const customer = await Customer.findById(payment.customer).session(session);

    // If it was cash, OR if it was a cleared check, we need to reverse the balance reduction
    // Only 'returned' checks don't need balance reversal on deletion because they were already reversed when marked 'returned'
    if (
      payment.method !== "check" ||
      payment.checkDetails.status !== "returned"
    ) {
      customer.balance += payment.amount;

      await addLedgerEntry({
        customer: customer._id,
        type: "payment_deleted",
        refId: payment._id,
        debit: payment.amount,
        credit: 0,
        balanceAfter: customer.balance,
        description: `حذف دفعة رقم ${payment.code} (عكس قيد)`,
        session,
      });
    }

    payment.isDeleted = true;
    await customer.save({ session });
    await payment.save({ session });

    await session.commitTransaction();
    session.endSession();
    return { message: "Payment deleted and balance adjusted" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
