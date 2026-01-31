const Invoice = require("../models/invoices.model");
const Payment = require("../models/payment.model");
const Customer = require("../models/customer.model");
const invoiceService = require("../services/invoice.service");
const paymentService = require("../services/payment.service");

exports.getAllChecks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.searchQuery?.trim() || "";
    const status = req.query.checkStatus?.trim() || "";

    // 1. Define match conditions
    const paymentMatch = { method: "check", isDeleted: false };
    const invoiceMatch = { paymentType: "check", isDeleted: false };

    if (status) {
      paymentMatch["checkDetails.status"] = status;
      invoiceMatch["checkDetails.status"] = status;
    }

    // 2. Build the Unified Pipeline
    const pipeline = [
      { $match: paymentMatch },
      {
        // Add a 'type' field to identify source
        $addFields: { type: "payment" },
      },
      {
        $unionWith: {
          coll: "invoices", // The name of your invoices collection in MongoDB
          pipeline: [
            { $match: invoiceMatch },
            {
              // Normalize 'paidAmount' to 'amount' and add type
              $addFields: {
                type: "invoice",
                amount: "$paidAmount",
              },
            },
          ],
        },
      },
      // 3. Common lookup and search (applied to the combined stream)
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

    // Add search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "checkDetails.checkNumber": { $regex: search, $options: "i" } },
            { "customer.name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // 4. Use $facet to get Total Stats AND Paginated Data in ONE query
    const today = new Date();
    today.setHours(23, 59, 59, 999); // لنهاية اليوم الحالي

    pipeline.push({
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
              dueCount: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$checkDetails.status", "pending"] },
                        { $lte: ["$checkDetails.dueDate", today] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              dueAmount: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$checkDetails.status", "pending"] },
                        { $lte: ["$checkDetails.dueDate", today] },
                      ],
                    },
                    "$amount",
                    0,
                  ],
                },
              },
            },
          },
        ],
        data: [
          { $sort: { "checkDetails.dueDate": 1, createdAt: -1 } }, // ترتيب حسب الاستحقاق
          { $skip: skip },
          { $limit: limit },
        ],
      },
    });

    const [results] = await Payment.aggregate(pipeline);

    const metadata = results.metadata[0] || {
      totalCount: 0,
      totalAmount: 0,
      dueCount: 0,
      dueAmount: 0,
    };
    const allChecks = results.data;

    res.json({
      AllChecks: allChecks,
      totalCount: metadata.totalCount,
      totalAmount: metadata.totalAmount,
      dueCount: metadata.dueCount,
      dueAmount: metadata.dueAmount,
      currentPage: page,
      totalPages: Math.ceil(metadata.totalCount / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCheckById = async (req, res) => {
  try {
    const check = await Invoice.findById(req.params.id)
      .populate("customer", "name")
      .lean();
    res.json(check);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCheck = async (req, res) => {
  try {
    const check = new Invoice(req.body);
    await check.save();
    res.json(check);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCheck = async (req, res) => {
  try {
    const check = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(check);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCheck = async (req, res) => {
  try {
    const check = await Invoice.findByIdAndDelete(req.params.id);
    res.json(check);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCheckStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Try finding in Invoices first
    let transaction = await Invoice.findById(id);
    if (transaction) {
      if (transaction.paymentType === "check") {
        const result = await invoiceService.updateCheckStatus(id, status);
        return res.json(result);
      }
    }

    // If not found or not a check in Invoices, try Payments
    transaction = await Payment.findById(id);
    if (transaction) {
      if (transaction.method === "check") {
        const result = await paymentService.updateCheckStatus(id, status);
        return res.json(result);
      }
    }

    return res.status(404).json({ message: "Check not found" });
  } catch (err) {
    console.error("Unified Update Check Status Error:", err);
    res.status(500).json({ message: err.message });
  }
};
