const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
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
customerSchema.index({ phone: 1 });
const customerModel = mongoose.model("Customer", customerSchema);
module.exports = customerModel;
