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

async function getAllStockIn(req) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  let query = {};

  if (search) {
    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    }).select("_id");
    const productIds = products.map((p) => p._id);
    query.productId = { $in: productIds };
  }

  const totalItems = await StockIn.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const stockIn = await StockIn.find(query)
    .populate({
      path: "productId",
      populate: { path: "category", select: "name" },
    })
    .skip(skip)
    .limit(limit);

  return {
    stockIn,
    pagination: { totalItems, page, limit, totalPages },
  };
}

async function getAllStockOut(req) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 5, 1);
  const skip = (page - 1) * limit;
  const totalItems = await StockOut.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);
  const stockOut = await StockOut.find()
    .populate({
      path: "productId",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .skip(skip)
    .limit(limit);
  if (!stockOut) throw new Error("No stock out found");

  return {
    stockOut,
    pagination: {
      totalItems,
      total: stockOut.length,
      page,
      limit,
      totalPages,
    },
  };
}

module.exports = {
  stockIn,
  stockOut,
  getAllStockIn,
  getAllStockOut,
};
