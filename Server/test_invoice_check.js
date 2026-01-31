const mongoose = require("mongoose");
const Invoice = require("./models/invoices.model");

// Mock IDs
const mockCustomerId = new mongoose.Types.ObjectId();
const mockProductId = new mongoose.Types.ObjectId();

async function testInvoiceOffline() {
  try {
    console.log("Running offline INVOICE validation tests...");

    // Test 1: Check invoice WITHOUT details -> Should FAIL
    // Note: Invoice validation also checks for items, etc., so we must provide minimal valid invoice data
    console.log("Test 1: Check invoice WITHOUT details");
    try {
      const inv1 = new Invoice({
        code: "INV-ERR-001",
        customer: mockCustomerId,
        items: [{ product: mockProductId, quantity: 1, price: 100 }],
        paymentType: "check",
        paidAmount: 0, // logic says status unpaid if 0
      });
      await inv1.validate();
      console.error(
        "FAILED: Expected error for missing check details, but got none.",
      );
    } catch (err) {
      if (err.message.includes("Check details")) {
        console.log("PASSED: Got expected validation error.");
      } else {
        console.log(
          "FAILED/WARNING: Got error, but maybe not the one we expected:",
          err.message,
        );
      }
    }

    // Test 2: Check invoice WITH details -> Should PASS
    console.log("Test 2: Check invoice WITH details");
    try {
      const inv2 = new Invoice({
        code: "INV-OK-001",
        customer: mockCustomerId,
        items: [{ product: mockProductId, quantity: 1, price: 100 }],
        paymentType: "check",
        checkDetails: {
          checkNumber: "CHK-999",
          bankName: "Invoice Bank",
          dueDate: new Date(),
        },
        paidAmount: 0,
      });
      await inv2.validate();
      console.log("PASSED: Validation successful for complete check invoice.");
    } catch (err) {
      console.error("FAILED: Got unexpected error:", err.message);
    }

    // Test 3: Cash invoice -> Should PASS
    console.log("Test 3: Cash invoice");
    try {
      const inv3 = new Invoice({
        code: "INV-CASH-001",
        customer: mockCustomerId,
        items: [{ product: mockProductId, quantity: 1, price: 100 }],
        paymentType: "cash",
        paidAmount: 0,
      });
      await inv3.validate();
      console.log("PASSED: Validation successful for cash invoice.");
    } catch (err) {
      console.error(
        "FAILED: Got unexpected error for cash invoice:",
        err.message,
      );
    }

    console.log("All Invoice tests completed.");
    process.exit(0);
  } catch (error) {
    console.error("Global Error:", error);
    process.exit(1);
  }
}

testInvoiceOffline();
