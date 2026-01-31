const Product = require("./models/products.model");
const { generateCode } = require("./utils/generateCode");
// src/server.js
const app = require("./app.js");
const customerModel = require("./models/customer.model.js");
require("dotenv").config();

require("./config/mongoose.config");

const PORT = process.env.PORT;

// Start server
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`,
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdown logic
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// const updateCustomers = async () => {
//   try {
//     const customers = await customerModel.find();

//     for (const cust of customers) {
//       const customerCode = await generateCode("customer", "CUS");
//       const updatedCustomer = await customerModel.findByIdAndUpdate(
//         cust._id,
//         { code: customerCode }, // هنا تحدد الحقل اللي بدك تحدثه
//         { new: true }, // يرجعلك النسخة المحدثة
//       );

//       console.log(updatedCustomer);
//     }

//     console.log("all the customers have been updated successfully");
//   } catch (error) {
//     console.error(error);
//   }
// };
// updateCustomers();
