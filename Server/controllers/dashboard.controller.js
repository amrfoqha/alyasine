const mongoose = require("mongoose");
const productModel = require("../models/products.model");
const productCategoryModel = require("../models/productCategories.model");
const customerModel = require("../models/customer.model");
const stockInModel = require("../models/stockIn.model");
const invoiceModel = require("../models/invoices.model");
const paymentModel = require("../models/payment.model");
const ledgerModel = require("../models/customerLedger.model");

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
      { $match: { ...dateFilter, isDeleted: false } },
      { $group: { _id: null, totalSales: { $sum: "$total" } } },
    ]);

    const totalMovements = await invoiceModel.countDocuments(dateFilter);
    // insure that exclude deleted invoices and payments and customerLedger and customer
    const totalDepts = await customerModel.aggregate([
      { $match: { balance: { $gt: 0 }, isDeleted: false } },
      { $group: { _id: null, Depts: { $sum: "$balance" } } },
    ]);

    const totalReceivedFromInvoices = await invoiceModel.aggregate([
      { $match: { ...dateFilter, paidAmount: { $gt: 0 }, isDeleted: false } },
      { $group: { _id: null, received: { $sum: "$paidAmount" } } },
    ]);

    // Net Collection from Ledger: sum(credit) - sum(debit) for payment-related types
    const netCollectionFromLedger = await ledgerModel.aggregate([
      {
        $match: {
          isDeleted: false,
          type: { $in: ["payment", "check_return", "payment_deleted"] },
          ...(startDate &&
            endDate && {
              date: { $gte: new Date(startDate), $lte: new Date(endDate) },
            }),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ["$credit", "$debit"] } },
        },
      },
    ]);

    // Financial collection summary: net payments + initial cash in invoices
    const netTotalCollection =
      (totalReceivedFromInvoices[0]?.received || 0) +
      (netCollectionFromLedger[0]?.total || 0);

    const recentFinancialActivity = await ledgerModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("customer", "name code")
      .lean();

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

    const topSellingProduct = await invoiceModel.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
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
      categoryDist,
      AllChecks,
      AllChecksCount,
      AllChecksAmount,
      totalReceived: netTotalCollection,
      recentFinancialActivity,
      countOutOfStock: countOutOfStock[0]?.outOfStock || 0,
      salesTrend,
      topCustomers,
      topSellingProduct: topSellingProduct[0]
        ? {
            ...topSellingProduct[0].productInfo,
            totalQuantitySold: topSellingProduct[0].totalQuantity,
          }
        : null,
    });
  } catch (err) {
    console.error("Get Dashboard Data Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getProductStockoutReport = async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query;

    const matchStage = {
      isDeleted: false,
      "items.product": new mongoose.Types.ObjectId(productId),
    };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchStage.date.$lte = end;
      }
    }

    const report = await invoiceModel.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      { $match: { "items.product": new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          invoiceCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    if (report.length === 0) {
      return res.json({
        totalQuantity: 0,
        totalRevenue: 0,
        invoiceCount: 0,
        product: null,
      });
    }

    res.json(report[0]);
  } catch (err) {
    console.error("Product Stockout Report Error:", err);
    res.status(500).json({ message: err.message });
  }
};
