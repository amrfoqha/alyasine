const productModel = require("../models/products.model");
const productCategoryModel = require("../models/productCategories.model");
const customerModel = require("../models/customer.model");
const stockInModel = require("../models/stockIn.model");
const invoiceModel = require("../models/invoices.model");
const paymentModel = require("../models/payment.model");

exports.getDashboardData = async (req, res) => {
  try {
    const productsCount = await productModel.countDocuments();
    const productCategoriesCount = await productCategoryModel.countDocuments();
    const customersCount = await customerModel.countDocuments();
    const lastStockIn = await stockInModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("productId");

    const sales = await invoiceModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 100 },
      { $group: { _id: null, totalSales: { $sum: "$total" } } },
    ]);

    const totalMovements = await invoiceModel.countDocuments();
    const totalDepts = await customerModel.aggregate([
      { $match: { balance: { $gt: 0 } } },
      { $group: { _id: null, Depts: { $sum: "$balance" } } },
    ]);

    // total received from invoices only
    const totalReceived = await invoiceModel.aggregate([
      { $match: { paidAmount: { $gt: 0 } } },
      { $group: { _id: null, received: { $sum: "$paidAmount" } } },
    ]);
    const totalPayments = await paymentModel.aggregate([
      { $match: { amount: { $gt: 0 } } },
      { $group: { _id: null, payments: { $sum: "$amount" } } },
    ]);
    const countOutOfStock = await productModel.aggregate([
      { $match: { quantity: { $lt: 1 } } },
      { $group: { _id: null, outOfStock: { $sum: 1 } } },
    ]);

    res.json({
      productsCount,
      productCategoriesCount,
      customersCount,
      lastStockIn,
      totalSales: sales[0]?.totalSales || 0,
      totalMovements,
      totalDepts: totalDepts[0]?.Depts || 0,
      totalReceived: totalReceived[0]?.received || 0,
      totalPayments: totalPayments[0]?.payments || 0,
      countOutOfStock: countOutOfStock[0]?.outOfStock || 0,
    });
  } catch (err) {
    console.error("Get Dashboard Data Error:", err);
    res.status(500).json({ message: err.message });
  }
};
