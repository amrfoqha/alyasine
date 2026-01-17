const mongoose = require("mongoose");
const Invoice = require("../models/invoices.model");
const Customer = require("../models/customer.model");
const StockIn = require("../models/stockIn.model");

exports.createInvoice = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerId, items, paymentType } = data;

    let total = 0;

    for (const item of items) {
      total += item.price * item.quantity;

      const stock = await StockIn.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(item.productId) } },
        { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
      ]);

      const availableQty = stock[0]?.totalQty || 0;

      if (availableQty < item.quantity) {
        throw new Error("Not enough stock");
      }

      await StockIn.findOneAndUpdate(
        { product: item.productId },
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    if (paymentType === "credit") {
      await Customer.findByIdAndUpdate(
        customerId,
        { $inc: { balance: total } },
        { session }
      );
    }

    const invoice = await Invoice.create(
      [
        {
          customer: customerId,
          items,
          total,
          paymentType,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return invoice[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
