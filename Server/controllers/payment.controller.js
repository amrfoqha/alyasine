const Payment = require("../models/payment.model");
const paymentService = require("../services/payment.service");
module.exports.createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment({ ...req.body });
    res.json(payment);
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.findAllPayments = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    const pipeline = [
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      { $sort: { createdAt: -1 } },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { code: { $regex: search.toLowerCase(), $options: "i" } },
            {
              "customer.name": { $regex: search.toLowerCase(), $options: "i" },
            },
          ],
        },
      });
    }
    pipeline.push(
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
    );
    const payments = await Payment.aggregate(pipeline);
    const totalPayments = await Payment.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(totalPayments / limit);
    const paymentsCount = await Payment.countDocuments({ isDeleted: false });
    res.json({
      payments,
      pagination: {
        page,
        limit,
        totalPayments,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        paymentsCount,
      },
    });
  } catch (error) {
    throw error;
    res.status(500).json({ message: error.message });
  }
};

module.exports.findPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
