const Product = require("../models/products.model");
const ProductCategory = require("../models/productCategories.model");
const { generateCode } = require("../utils/generateCode");
module.exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      sellPrice,
      quantity,
      unit,
      description,
      attributes,
    } = req.body;
    console.log(req.body);
    const existing = await Product.findOne({ name, category });
    if (existing) {
      return res.status(400).json({
        message:
          "Product with this name already exists in this category\n هذا المنتج موجود بالفعل في هذه الفئة",
      });
    }
    const productCode = await generateCode("product", "PRO");
    const product = await Product.create({
      code: productCode,
      name,
      category,
      sellPrice,
      quantity,
      unit,
      description,
      attributes: attributes || {},
    });
    await product.populate("category");

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).populate(
      "category",
      "name",
    );
    res.json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, {
      isDeleted: false,
    }).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

module.exports.getAllProductsByCategoryByPage = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    let query = { category: req.params.id, isDeleted: false };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const products = await Product.find(query)
      .populate("category")
      .skip(skip)
      .limit(limit);
    res.json({
      products,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

module.exports.getAllProductsNames = async (req, res) => {
  try {
    const products = await Product.find(
      { isDeleted: false },
      { name: 1 },
    ).lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
