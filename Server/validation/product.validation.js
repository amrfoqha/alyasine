const ProductCategory = require("../models/productCategories.model");

module.exports.validateProduct = async (req, res, next) => {
  try {
    const { name, category, sellPrice, attributes } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ message: "Product name is required" });

    if (!category)
      return res.status(400).json({ message: "Category ID is required" });

    const categoryFound = await ProductCategory.findById(category);
    if (!categoryFound)
      return res.status(404).json({ message: "Product category not found" });

    if (sellPrice === undefined || sellPrice <= 0)
      return res.status(400).json({ message: "Price must be greater than 0" });

    if (attributes && typeof attributes !== "object")
      return res.status(400).json({ message: "Attributes must be an object" });

    next();
  } catch (error) {
    console.error("Product Validation Error:", error);
    res.status(500).json({ message: "Server error during product validation" });
  }
};
