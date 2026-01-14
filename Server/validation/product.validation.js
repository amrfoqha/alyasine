import ProductCategory from "../models/ProductCategory.js";

export const validateProduct = async (req, res, next) => {
  try {
    const { name, categoryId, price, quantity, attributes } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ message: "Product name is required" });

    if (!categoryId)
      return res.status(400).json({ message: "Category ID is required" });

    const category = await ProductCategory.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Product category not found" });

    if (price === undefined || price <= 0)
      return res.status(400).json({ message: "Price must be greater than 0" });

    if (quantity === undefined || quantity < 0)
      return res.status(400).json({ message: "Quantity must be 0 or greater" });

    if (attributes && typeof attributes !== "object")
      return res.status(400).json({ message: "Attributes must be an object" });

    next();
  } catch (error) {
    console.error("Product Validation Error:", error);
    res.status(500).json({ message: "Server error during product validation" });
  }
};
