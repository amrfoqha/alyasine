const mongoose = require("mongoose");
const Invoice = require("../models/invoices.model");
const Customer = require("../models/customer.model");
const StockIn = require("../models/stockIn.model");
const { stockOut } = require("./stock.service");

exports.createInvoice = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer, items, paymentType, paidAmount = 0 } = data;

    console.log(items);
    // تحويل الكميات والأسعار إلى أرقام
    items.forEach((item) => {
      item.quantity = Number(item.quantity);
      item.price = Number(item.price);
    });
    // حساب الإجمالي
    const total = items.reduce(
      (sum, item) => Number(sum) + Number(item.price) * Number(item.quantity),
      0,
    );

    console.log(total);

    // ===== التحقق من المخزون وتحديثه =====
    for (const item of items) {
      const stock = await StockIn.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(item.product) } },
        { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
      ]);
      console.log(stock);
      const availableQty = stock[0]?.totalQty || 0;
      console.log(availableQty);
      if (availableQty < item.quantity) {
        throw new Error(`Not enough stock for product ${item.product}`);
      }

      await StockIn.findOneAndUpdate(
        { productId: item.product },
        { $inc: { quantity: -item.quantity } },
        { session },
      );

      await stockOut({
        productId: item.product,
        quantity: item.quantity,
      });
    }

    // ===== حساب المبلغ المتبقي وحالة الفاتورة =====
    let remainingAmount = total - paidAmount;
    let status = "unpaid";
    if (paidAmount === 0) status = "unpaid";
    else if (paidAmount < total) status = "partial";
    else status = "paid";

    // ===== تحديث رصيد الزبون إذا الدفع على credit =====
    if (paymentType === "credit") {
      await Customer.findByIdAndUpdate(
        customer,
        { $inc: { balance: remainingAmount } },
        { session },
      );
    }

    // ===== إنشاء الفاتورة =====
    const invoice = await Invoice.create(
      [
        {
          customer,
          items,
          total,
          paidAmount,
          remainingAmount,
          status,
          paymentType,
        },
      ],
      { session },
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

exports.getInvoiceById = async (id) => {
  return Invoice.findById(id).populate("customer");
};

exports.deleteInvoice = async (id) => {
  return Invoice.findByIdAndDelete(id);
};
