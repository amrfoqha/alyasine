const Product = require("../models/products.model");
const StockIn = require("../models/stockIn.model");

async function stockIn({ productId, quantity, cost }) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.quantity += quantity;
  await product.save();

  return await StockIn.create({
    product: productId,
    quantity,
    cost,
  });
}

async function stockOut({ productId, quantity }) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (product.quantity < quantity) throw new Error("Not enough stock");

  product.quantity -= quantity;
  await product.save();

  return product;
}

module.exports = {
  stockIn,
  stockOut,
};
