const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // invoice: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Invoice",
    //   default: null,
    // },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    method: {
      type: String,
      enum: ["cash", "bank", "check"],
      required: true,
    },

    note: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
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

module.exports = mongoose.model("Payment", paymentSchema);
