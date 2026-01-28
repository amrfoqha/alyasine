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
    let query = { isDeleted: false };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const customers = await Customer.find(query).skip(skip).limit(limit);
    const totalItems = await Customer.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const customersCount = await Customer.countDocuments({ isDeleted: false });
    res.json({
      customers,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        customersCount,
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

    // بناء فلتر التاريخ ديناميكياً
    let dateFilter = { customer: id, isDeleted: false };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.date.$lte = end;
      }
    }

    // جلب البيانات بالتوازي مع الفلترة
    const [invoices, payments] = await Promise.all([
      Invoice.find(dateFilter)
        .sort({ date: 1 })
        .populate("items.product", "name price unit")
        .lean(),
      Payment.find(dateFilter).sort({ date: 1 }).lean(),
    ]);

    res.json({
      customer,
      invoices,
      payments,
    });
  } catch (error) {
    console.error("Statement Error:", error);
    res.status(500).json({ message: "حدث خطأ أثناء استخراج كشف الحساب" });
  }
};
