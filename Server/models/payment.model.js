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
    checkDetails: {
      checkNumber: {
        type: String,
      },
      bankName: {
        type: String,
      },
      dueDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["pending", "cleared", "returned"],
        default: "pending",
      },
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

// Add validation to ensure checkDetails are present if method is check
paymentSchema.pre("validate", async function () {
  if (this.method === "check") {
    if (
      !this.checkDetails ||
      !this.checkDetails.checkNumber ||
      !this.checkDetails.bankName ||
      !this.checkDetails.dueDate
    ) {
      this.invalidate(
        "checkDetails",
        "Check details (number, bank, due date) are required for check payments",
      );
    }
  }
});

paymentSchema.index({ customer: 1, isDeleted: 1 });
paymentSchema.index({ "checkDetails.checkNumber": 1 });
paymentSchema.index({ code: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
