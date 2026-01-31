const Customer = require("../models/customer.model");
const { generateCode } = require("../utils/generateCode");
const Invoice = require("../models/invoices.model");
const Payment = require("../models/payment.model");
module.exports.findCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.findAllCustomers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const { search } = req.query;

    const pipeline = [{ $match: { isDeleted: false } }];

    // 1. Add Search Stage if search exists
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search.trim(), $options: "i" } },
            { code: { $regex: search.trim(), $options: "i" } },
            { phone: { $regex: search.trim(), $options: "i" } },
            { address: { $regex: search.trim(), $options: "i" } },
          ],
        },
      });
    }

    // 2. The Facet Stage: Handles Count and Data simultaneously
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { createdAt: -1 } }, // Assuming you want newest first
          { $skip: skip },
          { $limit: limit },
        ],
      },
    });

    const [result] = await Customer.aggregate(pipeline);

    // 3. Extract results safely
    const totalItems = result.metadata[0]?.total || 0;
    const customers = result.data;
    const totalPages = Math.ceil(totalItems / limit);

    // Optional: If you still need the count of ALL customers regardless of search:
    const customersCount = search
      ? await Customer.countDocuments({ isDeleted: false })
      : totalItems;

    res.json({
      customers,
      pagination: {
        page,
        limit,
        totalItems, // Total matches for the search
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        customersCount, // Total customers in DB
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.createCustomer = async (req, res) => {
  try {
    const cust = await Customer.findOne({ name: req.body.name.toLowerCase() });
    if (cust) {
      return res.status(400).json({ message: "العميل موجود بالفعل" });
    }
    const customerCode = await generateCode("customer", "CUS");
    const customer = await Customer.create({
      ...req.body,
      code: customerCode,
    });
    res.json(customer);
  } catch (error) {
    console.error("Create Customer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateCustomer = async (req, res) => {
  try {
    console.log(req.params.id, req.body);
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      validateBeforeSave: true,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getCustomerNames = async (req, res) => {
  try {
    const customers = await Customer.find({}, { name: 1 }).lean();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ isDeleted: false }).lean();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getCustomerStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const customer = await Customer.findById(id).lean();
    if (!customer) {
      return res.status(404).json({ message: "العميل غير موجود" });
    }

    const CustomerLedger = require("../models/customerLedger.model");

    // Build filter
    let dateFilter = { customer: id, isDeleted: false };
    if (startDate || endDate) {
      dateFilter.date = {}; // Ledger entries usually use createdAt for their timestamp
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.date.$lte = end;
      }
    }

    // Fetch ledger entries
    const ledgerEntries = await CustomerLedger.find(dateFilter)
      .sort({ createdAt: 1 })
      .lean();

    // Enrich entries with document details
    const enrichedEntries = await Promise.all(
      ledgerEntries.map(async (entry) => {
        if (entry.type === "invoice") {
          const inv = await Invoice.findById(entry.refId).select("code").lean();
          return { ...entry, details: inv };
        }
        if (entry.type === "payment") {
          const pay = await Payment.findById(entry.refId)
            .select("code method checkDetails")
            .lean();
          return { ...entry, details: pay };
        }
        return entry;
      }),
    );

    res.json({
      customer,
      ledgerEntries: enrichedEntries,
    });
  } catch (error) {
    console.error("Statement Error:", error);
    res.status(500).json({ message: "حدث خطأ أثناء استخراج كشف الحساب" });
  }
};
