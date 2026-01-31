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
const checkRoutes = require("./routes/check.routes.js");
const ledgerRoutes = require("./routes/customerLedger.routes.js");
const { protect } = require("./middleware/auth.middleware.js");
const { errorHandler } = require("./middleware/error.middleware.js");
const {
  setupSecurity,
  setupSanitization,
} = require("./middleware/security.middleware.js");

const app = express();

const whitelist = [
  process.env.CLIENT_URL,
  "https://alyasine-frontend.onrender.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

setupSecurity(app);

// Body parser with limits
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb" }));

setupSanitization(app);

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/customers", protect, customerRoutes);
app.use("/api/products", protect, productRoutes);
app.use("/api/categories", protect, categoryRoutes);
app.use("/api/invoices", protect, invoiceRoutes);
app.use("/api/payments", protect, paymentRoutes);
app.use("/api/stock", protect, stockRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/checks", protect, checkRoutes);
app.use("/api/ledger", ledgerRoutes);

app.use(errorHandler);

module.exports = app;
