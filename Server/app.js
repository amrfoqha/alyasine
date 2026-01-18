const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const customerRoutes = require("./routes/customer.routes.js");
const productRoutes = require("./routes/product.routes.js");
const categoryRoutes = require("./routes/productCategory.routes.js");
const invoiceRoutes = require("./routes/invoice.routes.js");
const paymentRoutes = require("./routes/payment.routes.js");
const stockRoutes = require("./routes/stock.routes.js");
const authRoutes = require("./routes/auth.routes.js");

const { protect } = require("./middleware/auth.middleware.js");
const { errorHandler } = require("./middleware/error.middleware.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/customers", protect, customerRoutes);
app.use("/api/products", protect, productRoutes);
app.use("/api/categories", protect, categoryRoutes);
app.use("/api/invoices", protect, invoiceRoutes);
app.use("/api/payments", protect, paymentRoutes);
app.use("/api/stock", protect, stockRoutes);

app.use(errorHandler);

module.exports = app;
