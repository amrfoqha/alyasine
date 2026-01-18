const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    attributes: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
);
const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
