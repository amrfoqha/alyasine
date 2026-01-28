const Invoice = require("../models/invoices.model");
const invoiceService = require("../services/invoice.service");
const mongoose = require("mongoose");

module.exports.createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.findAllInvoicesByPage = async (req, res) => {
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
            { "customer.name": { $regex: search, $options: "i" } },
            { code: { $regex: search, $options: "i" } },
            {
              "checkDetails.checkNumber": { $regex: search, $options: "i" },
            },
          ],
        },
      });
    }

    pipeline.push({ $skip: skip }, { $limit: limit });

    const invoices = await Invoice.aggregate(pipeline);

    // ===== عدد الفواتير =====
    const countPipeline = pipeline.filter(
      (stage) => !("$skip" in stage) && !("$limit" in stage),
    );
    countPipeline.push({ $count: "totalItems" });
    const countResult = await Invoice.aggregate(countPipeline);
    const totalItems = countResult[0]?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const totalInvoices = await Invoice.countDocuments();

    res.json({
      totalInvoices,
      invoices,
      pagination: {
        totalItems,
        totalPages,
        page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

// ===== جلب فاتورة واحدة =====
module.exports.findInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== حذف فاتورة =====
module.exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.deleteInvoice(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== جلب فواتير حسب الزبون =====
module.exports.findInvoiceByCustomer = async (req, res) => {
  try {
    const invoices = await Invoice.find({ customer: req.params.id });
    if (!invoices || invoices.length === 0)
      return res.status(404).json({ message: "Invoices not found" });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.findAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
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

    const invoice = await invoiceService.updateCheckStatus(
      req.params.id,
      status,
    );
    res.json(invoice);
  } catch (error) {
    console.error("Update Invoice Check Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};
