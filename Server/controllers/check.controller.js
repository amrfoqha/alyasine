const Invoice = require("../models/invoices.model");
const Payment = require("../models/payment.model");
const Customer = require("../models/customer.model");

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

    const [results] = await Payment.aggregate(pipeline);

    const metadata = results.metadata[0] || { totalCount: 0, totalAmount: 0 };
    const allChecks = results.data;

    res.json({
      AllChecks: allChecks,
      totalCount: metadata.totalCount,
      totalAmount: metadata.totalAmount,
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
