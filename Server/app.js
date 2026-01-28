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
const dashboardRoutes = require("./routes/dashboard.routes.js");
const { protect } = require("./middleware/auth.middleware.js");
const { errorHandler } = require("./middleware/error.middleware.js");
const {
  setupSecurity,
  setupSanitization,
} = require("./middleware/security.middleware.js");

const app = express();

app.use(cors());

// Setup Security Headers, Rate Limiting, Compression
setupSecurity(app); // TODO: Uncomment after running `npm install helmet express-rate-limit express-mongo-sanitize xss-clean compression`

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Data Sanitization (must be after body parser)
setupSanitization(app); // TODO: Uncomment after running `npm install helmet express-rate-limit express-mongo-sanitize xss-clean compression`

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/customers", protect, customerRoutes);
app.use("/api/products", protect, productRoutes);
app.use("/api/categories", protect, categoryRoutes);
app.use("/api/invoices", protect, invoiceRoutes);
app.use("/api/payments", protect, paymentRoutes);
app.use("/api/stock", protect, stockRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);

app.use(errorHandler);

module.exports = app;
