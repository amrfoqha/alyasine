const Customer = require("../models/customer.model");
const Product = require("../models/products.model");

module.exports.validateInvoice = async (req, res, next) => {
  try {
    const { customer, items, paymentType, paidAmount = 0 } = req.body;

    // ✅ تحقق من وجود العميل
    if (!customer)
      return res.status(400).json({ message: "Customer required" });

    const customerFound = await Customer.findById(customer);
    if (!customerFound)
      return res.status(404).json({ message: "Customer not found" });

    // ✅ تحقق من وجود أصناف
    if (!items || !items.length)
      return res.status(400).json({ message: "Invoice must have items" });

    // ✅ تحقق من paidAmount
    if (paidAmount < 0)
      return res.status(400).json({ message: "Invalid paid amount" });

    // ✅ تحقق من طريقة الدفع
    if (!["cash", "bank", "check"].includes(paymentType))
      return res.status(400).json({ message: "Invalid payment type" });

    if (paymentType === "check") {
      const { checkDetails } = req.body;
      if (
        !checkDetails ||
        !checkDetails.checkNumber ||
        !checkDetails.bankName ||
        !checkDetails.dueDate
      ) {
        return res.status(400).json({
          message:
            "Check details (number, bank, due date) are required for check payments",
        });
      }
    }

    // ✅ جلب جميع المنتجات مرة واحدة
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    for (const item of items) {
      if (!item.product)
        return res.status(400).json({ message: "Product ID is required" });

      if (!item.quantity || item.quantity <= 0)
        return res.status(400).json({ message: "Quantity must be positive" });

      const product = productMap.get(item.product.toString());
      if (!product)
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });

      if (product.quantity < item.quantity)
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.quantity}`,
        });

      // ✅ تثبيت السعر من DB
      item.price = product.sellPrice;
    }

    next();
  } catch (error) {
    console.error("Invoice Validation Error:", error);
    res.status(500).json({ message: "Server error during invoice validation" });
  }
};
