const Customer = require("../models/customer.model");
const Product = require("../models/products.model");

module.exports.validateInvoice = async (req, res, next) => {
  try {
    const { customerId, items, paymentType } = req.body;

    if (!customerId)
      return res.status(400).json({ message: "Customer required" });

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (!items || !items.length)
      return res.status(400).json({ message: "Invoice must have items" });

    for (const item of items) {
      if (!item.productId)
        return res.status(400).json({ message: "Product ID is required" });

      if (!item.quantity || item.quantity <= 0)
        return res.status(400).json({ message: "Quantity must be positive" });

      if (!item.price || item.price <= 0)
        return res.status(400).json({ message: "Price must be positive" });

      const product = await Product.findById(item.productId);
      if (!product)
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });

      if (product.quantity < item.quantity)
        return res.status(400).json({
          message: `Not enough stock for product ${product.name}. Available: ${product.quantity}`,
        });
    }

    if (!["cash", "credit"].includes(paymentType))
      return res.status(400).json({ message: "Invalid payment type" });

    next();
  } catch (error) {
    console.error("Invoice Validation Error:", error);
    res.status(500).json({ message: "Server error during invoice validation" });
  }
};
