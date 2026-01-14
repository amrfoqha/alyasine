const Invoice = require("../models/invoices.model");
const Customer = require("../models/customer.model");
const Product = require("../models/products.model");
// invoice.service.js
module.exports.createInvoice = async (data) => {
  const { customerId, items, paymentType } = data;

  // 1️⃣ احسب المجموع
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // 2️⃣ خصم من المخزون
  for (let item of items) {
    const product = await Product.findById(item.productId);
    product.quantity -= item.quantity;
    await product.save();
  }

  // 3️⃣ تحديث رصيد الزبون
  if (paymentType === "credit") {
    const customer = await Customer.findById(customerId);
    customer.balance += total;
    await customer.save();
  }

  // 4️⃣ حفظ الفاتورة
  const invoice = await Invoice.create({ ...data, total });
  return invoice;
};
