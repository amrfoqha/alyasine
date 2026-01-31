const mongoose = require("mongoose");
const Invoice = require("../models/invoices.model");
const Customer = require("../models/customer.model");
const StockIn = require("../models/stockIn.model");
const { stockOut } = require("./stock.service");
const { generateCode } = require("../utils/generateCode");
const { addLedgerEntry } = require("./ledger.service");

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
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    for (const item of items) {
      const stock = await StockIn.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(item.product) } },
        { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
      ]);

      const availableQty = stock[0]?.totalQty || 0;
      if (availableQty < item.quantity) throw new Error("Not enough stock");

      await stockOut({ productId: item.product, quantity: item.quantity });
    }

    const remainingAmount = total - paidAmount;

    const customerDoc = await Customer.findById(customer).session(session);
    customerDoc.balance += remainingAmount;
    customerDoc.orders += 1;
    await customerDoc.save({ session });

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
          paymentType,
          checkDetails,
        },
      ],
      { session },
    );

    await addLedgerEntry({
      customer,
      type: "invoice",
      refId: invoice[0]._id,
      debit: remainingAmount,
      credit: 0,
      balanceAfter: customerDoc.balance,
      description: "فاتورة بيع رقم " + invoiceCode,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    await invoice[0].populate("customer");
    return invoice[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

exports.updateCheckStatus = async (invoiceId, newStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await Invoice.findById(invoiceId).session(session);
    if (!invoice) throw new Error("Invoice not found");

    const customer = await Customer.findById(invoice.customer).session(session);

    const oldStatus = invoice.checkDetails.status;
    if (oldStatus === newStatus) return invoice;

    if (oldStatus === "pending" && newStatus === "returned") {
      customer.balance += invoice.paidAmount;

      await addLedgerEntry({
        customer: customer._id,
        type: "check_return",
        refId: invoice._id,
        debit: invoice.paidAmount,
        credit: 0,
        balanceAfter: customer.balance,
        description: "شيك راجع على فاتورة " + invoice.code,
        session,
      });
    }

    invoice.checkDetails.status = newStatus;
    await customer.save({ session });
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();
    return invoice;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

exports.getInvoiceById = async (id) => {
  return await Invoice.findById(id)
    .populate("customer")
    .populate("items.product");
};

exports.deleteInvoice = async (invoiceId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await Invoice.findById(invoiceId).session(session);
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.isDeleted) throw new Error("Invoice already deleted");

    const customer = await Customer.findById(invoice.customer).session(session);
    if (!customer) throw new Error("Customer not found");

    // 1. Reverse Stock
    for (const item of invoice.items) {
      const Product = mongoose.model("Product");
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.quantity = Number(product.quantity) + Number(item.quantity);
        await product.save({ session });
      }
    }

    // 2. Reverse Balance
    customer.balance -= invoice.remainingAmount;
    customer.orders = Math.max(0, customer.orders - 1);
    await customer.save({ session });

    // 3. Mark as Deleted
    invoice.isDeleted = true;
    await invoice.save({ session });

    // 4. Ledger Entry
    await addLedgerEntry({
      customer: customer._id,
      type: "invoice_deleted",
      refId: invoice._id,
      debit: 0,
      credit: invoice.remainingAmount,
      balanceAfter: customer.balance,
      description: `حذف فاتورة رقم ${invoice.code} (عكس قيد)`,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Invoice deleted and balance/stock reversed successfully",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
