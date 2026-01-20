const Invoice = require("../models/invoices.model");
const invoiceService = require("../services/invoice.service");

module.exports.createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require("mongoose");

module.exports.findAllInvoices = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    const pipeline = [
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerData",
        },
      },
      { $unwind: "$customerData" },
    ];

    if (search) {
      pipeline.push({
        $match: {
          "customerData.name": { $regex: search, $options: "i" },
        },
      });
    }

    pipeline.push({ $skip: skip }, { $limit: limit });

    const invoices = await Invoice.aggregate(pipeline);
    const countPipeline = pipeline.filter(
      (stage) => !("$skip" in stage) && !("$limit" in stage),
    );

    countPipeline.push({ $count: "totalItems" });

    const countResult = await Invoice.aggregate(countPipeline);
    const totalItems = countResult[0]?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const invoicesCount = await Invoice.countDocuments();

    res.json({
      invoices,
      pagination: {
        totalItems,
        totalPages,
        page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        invoicesCount,
      },
    });
  } catch (error) {
    console.error("Find Invoices Error:", error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

module.exports.findInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.findInvoiceByCustomer = async (req, res) => {
  try {
    const invoice = await Invoice.find({ customer: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
