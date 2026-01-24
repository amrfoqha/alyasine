const mongoose = require("mongoose");
const Invoice = require("../models/invoices.model");
const Customer = require("../models/customer.model");
const StockIn = require("../models/stockIn.model");
const Counter = require("../models/counter.model");
const { stockOut } = require("./stock.service");
const { generateCode } = require("../utils/generateCode");

exports.createInvoice = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer, items, paymentType, paidAmount = 0 } = data;

    items.forEach((item) => {
      item.quantity = Number(item.quantity);
      item.price = Number(item.price);
    });

    const total = items.reduce(
      (sum, item) => Number(sum) + Number(item.price) * Number(item.quantity),
      0,
    );

    for (const item of items) {
      const stock = await StockIn.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(item.product) } },
        { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
      ]);
      const availableQty = stock[0]?.totalQty || 0;
      if (availableQty < item.quantity) {
        throw new Error(`Not enough stock for product ${item.product}`);
      }

      await stockOut({
        productId: item.product,
        quantity: item.quantity,
      });
    }

    // ===== حساب المبلغ المتبقي وحالة الفاتورة =====
    let remainingAmount = total - Number(paidAmount);
    let status = "unpaid";
    if (Number(paidAmount) === 0) status = "unpaid";
    else if (Number(paidAmount) < total) status = "partial";
    else status = "paid";

    // ===== تحديث رصيد الزبون إذا الدفع على credit =====
    console.log(remainingAmount);
    const customer1 = await Customer.findByIdAndUpdate(
      customer,
      { $inc: { balance: remainingAmount, orders: 1 } },
      { session },
    );
    console.log(customer1);

    // ===== إنشاء الفاتورة =====
    const invoiceCode = await generateCode("invoice", "INV", session);
    const invoice = await Invoice.create(
      [
        {
          code: invoiceCode,
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

    await invoice[0].populate("customer");

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
  try {
    const invoice = await Invoice.findById(id)
      .populate("customer")
      .populate("items.product");
    if (!invoice) return res.status(404).json({ message: "Not found" });
    return invoice;
  } catch (error) {
    console.error("Get Invoice Error:", error);
    throw error;
  }
};

exports.deleteInvoice = async (id) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) return res.status(404).json({ message: "Not found" });
    return invoice;
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    throw error;
  }
};
