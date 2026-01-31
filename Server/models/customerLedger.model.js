const mongoose = require("mongoose");

const customerLedgerSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    type: {
      type: String,
      enum: ["invoice", "payment", "check_return", "check_cleared"],
      required: true,
    },

    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    description: String,

    debit: { type: Number, default: 0 }, // عليه
    credit: { type: Number, default: 0 }, // له

    balanceAfter: { type: Number, required: true },

    date: { type: Date, default: Date.now },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

customerLedgerSchema.index({ customer: 1, date: 1 });

module.exports = mongoose.model("CustomerLedger", customerLedgerSchema);
