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
    ];

    // Apply search filter to the pipeline BEFORE counting/paging
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { code: { $regex: search, $options: "i" } },
            { "checkDetails.checkNumber": { $regex: search, $options: "i" } },
            { "customer.name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // The Magic: Get Count and Data in one go
    pipeline.push({
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    });

    const [result] = await Payment.aggregate(pipeline);
    const PendingCheck = await Payment.aggregate([
      {
        $match: {
          method: "check",
          "checkDetails.status": "pending",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalPayments = result.metadata[0]?.totalCount || 0;
    const totalAmount = result.metadata[0]?.totalAmount || 0;
    const totalPages = Math.ceil(totalPayments / limit);
    const payments = result.data;

    res.json({
      payments,
      pagination: {
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        totalPayments,
        totalAmount,
        countPendingCheck: PendingCheck[0]?.totalCount || 0,
        totalCheckPendingAmount: PendingCheck[0]?.totalAmount || 0,
      },
    });
  } catch (error) {
    // Note: Don't 'throw error' before res.status, or the response will never send!
    res.status(500).json({ message: error.message });
  }
};

module.exports.findPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id, { isDeleted: false });
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
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { isDeleted: false },
      {
        new: true,
      },
    );
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
    const result = await paymentService.deletePayment(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateCheckStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "cleared", "returned"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const payment = await paymentService.updateCheckStatus(
      req.params.id,
      status,
    );
    res.json(payment);
  } catch (error) {
    console.error("Update Check Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};
