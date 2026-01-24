const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
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

    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],
      validate: [
        {
          validator: (v) => v.length > 0,
          message: "الفاتورة يجب أن تحتوي على صنف واحد على الأقل",
        },
      ],
    },

    total: {
      type: Number,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["paid", "partial", "unpaid"],
      default: "unpaid",
    },

    paymentType: {
      type: String,
      enum: ["cash", "bank", "check"],
      required: true,
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
  { timestamps: true },
);

invoiceSchema.pre("save", async function () {
  // حساب الإجمالي
  this.total = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // التحقق من المبلغ المدفوع
  if (this.paidAmount > this.total) {
    throw new Error("المبلغ المدفوع لا يمكن أن يكون أكبر من الإجمالي");
  }

  // حساب الباقي
  this.remainingAmount = this.total - this.paidAmount;

  // تحديث الحالة
  if (this.paidAmount === 0) this.status = "unpaid";
  else if (this.paidAmount < this.total) this.status = "partial";
  else this.status = "paid";
});

module.exports = mongoose.model("Invoice", invoiceSchema);
