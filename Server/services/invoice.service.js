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
    const { customer, items, paymentType, paidAmount = 0, checkDetails } = data;

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

    let remainingAmount = total - Number(paidAmount);
    let status = "unpaid";
    if (Number(paidAmount) === 0) status = "unpaid";
    else if (Number(paidAmount) < total) status = "partial";
    else status = "paid";

    let amountToAddToBalance = remainingAmount;

    const customer1 = await Customer.findByIdAndUpdate(
      customer,
      { $inc: { balance: amountToAddToBalance, orders: 1 } },
      { session },
    );

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
          checkDetails,
        },
      ],
      { session },
    );

    await invoice[0].populate("customer");

    await session.commitTransaction();
    session.endSession();

    return invoice[0];
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

exports.updateCheckStatus = async (invoiceId, newStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoice = await Invoice.findById(invoiceId).session(session);
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.paymentType !== "check")
      throw new Error("Only check invoices have a status");

    const oldStatus = invoice.checkDetails.status;
    if (oldStatus === newStatus) return invoice;

    const customer = await Customer.findById(invoice.customer).session(session);
    if (!customer) throw new Error("Customer not found");

    // منطق تحديث الرصيد بناءً على حالة الشيك
    if (oldStatus === "cleared" && newStatus !== "cleared") {
      // كان مصروف ورجع -> نعيد القيمة لرصيد العميل
      customer.balance += invoice.paidAmount;
    }

    invoice.checkDetails.status = newStatus;
    await customer.save({ session });
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    await invoice.populate("customer");
    return invoice;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getInvoiceById = async (id) => {
  try {
    const invoice = await Invoice.findById(id, { isDeleted: false })
      .populate("customer")
      .populate("items.product");
    return invoice;
  } catch (error) {
    console.error("Get Invoice Error:", error);
    throw error;
  }
};

exports.deleteInvoice = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoice = await Invoice.findById(id).session(session);
    if (!invoice) throw new Error("Invoice not found");
    await invoice.populate("customer");
    if (invoice.isDeleted) throw new Error("Invoice already deleted");
    const customer = await Customer.findById(invoice.customer).session(session);
    if (customer) {
      // عكس العملية: نخصم ما تمت إضافته للرصيد
      let amountToRemoveFromBalance = invoice.total - invoice.paidAmount; // default remaining

      if (
        invoice.paymentType === "check" &&
        invoice.checkDetails.status !== "cleared"
      ) {
        // الشيك لم يصرف بعد، يعني أضفنا الإجمالي كاملاً للرصيد سابقاً
        amountToRemoveFromBalance = invoice.total;
      }

      customer.balance -= amountToRemoveFromBalance;
      customer.orders = Math.max(0, customer.orders - 1);
      await customer.save({ session });
    }

    // هنا يمكن إضافة كود لإرجاع الكميات للمخزن إذا أردت
    // ...

    invoice.items.forEach(async (item) => {
      await StockIn.create({
        productId: item.product,
        quantity: item.quantity,
        date: Date.now(),
        note:
          "راجع من فاتورة رقم " +
          invoice.code +
          "لزبون :" +
          invoice.customer.name,
        costPrice: item.price,
      });
    });

    await Invoice.findByIdAndUpdate(id, { isDeleted: true }).session(session);

    await session.commitTransaction();
    session.endSession();
    return invoice;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
