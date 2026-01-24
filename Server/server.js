const Invoice = require("./models/invoices.model");
const { generateCode } = require("./utils/generateCode");
// src/server.js
const app = require("./app.js");
require("dotenv").config();

require("./config/mongoose.config");

const PORT = process.env.PORT;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const updateInvoices = async () => {
//   try {
//     const invoices = await Invoice.find();

//     for (const inv of invoices) {
//       const invoiceCode = await generateCode("invoice", "INV");
//       const updatedInvoice = await Invoice.findByIdAndUpdate(
//         inv._id,
//         { code: invoiceCode }, // هنا تحدد الحقل اللي بدك تحدثه
//         { new: true }, // يرجعلك النسخة المحدثة
//       );

//       console.log(updatedInvoice);
//     }

//     console.log("تم تحديث جميع الفواتير");
//   } catch (error) {
//     console.error(error);
//   }
// };
// updateInvoices();
