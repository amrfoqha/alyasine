const Product = require("../models/products.model");
const ProductCategory = require("../models/productCategories.model");

module.exports.createProduct = async (req, res) => {
  try {
    const { name, categoryId, price, quantity, attributes } = req.body;
    const existing = await Product.findOne({ name, categoryId });
    if (existing) {
      return res.status(400).json({
        message: "Product with this name already exists in this category",
      });
    }

    const product = await Product.create({
      name,
      categoryId,
      price,
      quantity,
      attributes: attributes || {},
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId",
      "name"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
