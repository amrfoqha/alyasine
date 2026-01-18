const Product = require("../models/products.model");
const StockIn = require("../models/stockIn.model");

async function stockIn({ productId, quantity, costPrice, date, note }) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.quantity = Number(product.quantity) + Number(quantity);
  await product.save();

  return await StockIn.create({
    productId,
    quantity,
    costPrice,
    date,
    note,
  });
}

async function stockOut({ productId, quantity }) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (product.quantity < quantity) throw new Error("Not enough stock");

  product.quantity = Number(product.quantity) - Number(quantity);
  await product.save();

  return product;
}

module.exports = {
  stockIn,
  stockOut,
};
