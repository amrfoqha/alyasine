const mongoose = require("mongoose");
const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const productCategoryModel = mongoose.model(
  "ProductCategory",
  productCategorySchema
);
module.exports = productCategoryModel;
