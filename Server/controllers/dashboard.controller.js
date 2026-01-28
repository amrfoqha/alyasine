const productModel = require("../models/products.model");
const productCategoryModel = require("../models/productCategories.model");
const customerModel = require("../models/customer.model");
const stockInModel = require("../models/stockIn.model");
const invoiceModel = require("../models/invoices.model");
const paymentModel = require("../models/payment.model");

exports.getDashboardData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = { isDeleted: false };
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const productsCount = await productModel.countDocuments();
    const productCategoriesCount = await productCategoryModel.countDocuments();
    const customersCount = await customerModel.countDocuments();
    const lastStockIn = await stockInModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("productId");

    const sales = await invoiceModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalSales: { $sum: "$total" } } },
    ]);

    const totalMovements = await invoiceModel.countDocuments(dateFilter);
    const totalDepts = await customerModel.aggregate([
      { $match: { balance: { $gt: 0 } } },
      { $group: { _id: null, Depts: { $sum: "$balance" } } },
    ]);

    // total received from invoices only
    const totalReceived = await invoiceModel.aggregate([
      { $match: { ...dateFilter, paidAmount: { $gt: 0 } } },
      { $group: { _id: null, received: { $sum: "$paidAmount" } } },
    ]);
    const totalPayments = await paymentModel.aggregate([
      { $match: { ...dateFilter, amount: { $gt: 0 } } },
      { $group: { _id: null, payments: { $sum: "$amount" } } },
    ]);
    const countOutOfStock = await productModel.aggregate([
      { $match: { quantity: { $lt: 1 } } },
      { $group: { _id: null, outOfStock: { $sum: 1 } } },
    ]);

    const salesTrend = await invoiceModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const topCustomers = await customerModel
      .find({ isDeleted: false })
      .sort({ balance: -1 })
      .limit(5)
      .select("name balance code");

    const categoryDist = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          name: "$categoryInfo.name",
          value: "$count",
        },
      },
    ]);

    // Run queries in parallel to save time
    const [payments, invoices] = await Promise.all([
      paymentModel
        .find(
          {
            method: "check",
            "checkDetails.status": "pending",
            isDeleted: false,
          },
          { code: 1, checkDetails: 1, amount: 1, customer: 1, date: 1 },
        )
        .populate("customer", "name")
        .lean(),

      invoiceModel
        .find(
          {
            paymentType: "check",
            "checkDetails.status": "pending",
            isDeleted: false,
          },
          { code: 1, checkDetails: 1, paidAmount: 1, customer: 1, date: 1 },
        )
        .populate("customer", "name")
        .lean(),
    ]);

    const AllChecks = [
      ...payments.map(({ amount, ...p }) => ({
        ...p,
        type: "payment",
        amount,
      })),
      ...invoices.map(({ paidAmount, ...i }) => ({
        ...i,
        type: "invoice",
        amount: paidAmount,
      })),
    ];

    const AllChecksCount = AllChecks.length;
    const AllChecksAmount = AllChecks.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );

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
      salesTrend,
      topCustomers,
      categoryDist,
      AllChecks,
      AllChecksCount,
      AllChecksAmount,
    });
  } catch (err) {
    console.error("Get Dashboard Data Error:", err);
    res.status(500).json({ message: err.message });
  }
};
