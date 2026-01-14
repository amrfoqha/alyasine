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
    const productCategories = await ProductCategory.find();
    res.json(productCategories);
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
      }
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
      req.params.id
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
