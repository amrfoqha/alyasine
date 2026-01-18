const ProductCategory = require("../models/productCategories.model");

module.exports.createProductCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.create(req.body);
    res.json(productCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This category name already exists. Please choose another.",
      });
    }

    res.status(400).json({ message: error.message });
  }
};

module.exports.findAllProductCategories = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const totalItems = await ProductCategory.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const productCategories = await ProductCategory.find()
      .skip(skip)
      .limit(limit);
    res.json({
      productCategories,
      pagination: {
        totalItems,
        total: productCategories.length,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateProductCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        validateBeforeSave: true,
      },
    );
    if (!productCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }
    res.json(productCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteProductCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.findByIdAndDelete(
      req.params.id,
    );
    if (!productCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }
    res.json(productCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.findProductCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.findById(req.params.id);
    if (!productCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }
    res.json(productCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
