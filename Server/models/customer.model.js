const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  },
);
const customerModel = mongoose.model("Customer", customerSchema);
module.exports = customerModel;
