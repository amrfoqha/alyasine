const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);
productSchema.index({ category: 1 });
const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
