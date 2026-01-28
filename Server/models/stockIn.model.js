const mongoose = require("mongoose");
const stockInSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const stockInModel = mongoose.model("StockIn", stockInSchema);
stockInSchema.index({ productId: 1 }); // Critical for invoice stock checks
module.exports = stockInModel;
