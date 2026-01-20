const productModel = require("../models/products.model");
const productCategoryModel = require("../models/productCategories.model");
const customerModel = require("../models/customer.model");
const stockInModel = require("../models/stockIn.model");

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
    // const invoicesCount = await invoiceModel.countDocuments();
    // const paymentsCount = await paymentModel.countDocuments();
    // const stockInCount = await stockInModel.countDocuments();
    // const stockOutCount = await stockOutModel.countDocuments();

    res.json({
      productsCount,
      productCategoriesCount,
      customersCount,
      lastStockIn,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
