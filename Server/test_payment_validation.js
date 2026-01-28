const mongoose = require("mongoose");
const Payment = require("./models/payment.model");

// Mock customer ID
const mockCustomerId = new mongoose.Types.ObjectId();

async function testPaymentOffline() {
  try {
    console.log("Running offline validation tests...");

    // Test 1: Check payment WITHOUT details -> Should FAIL
    console.log("Test 1: Check payment WITHOUT details");
    try {
      const p1 = new Payment({
        code: "PAY-ERR-001",
        customer: mockCustomerId,
        amount: 100,
        method: "check",
      });
      await p1.validate();
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

    // Test 2: Check payment WITH details -> Should PASS
    console.log("Test 2: Check payment WITH details");
    try {
      const p2 = new Payment({
        code: "PAY-OK-001",
        customer: mockCustomerId,
        amount: 100,
        method: "check",
        checkDetails: {
          checkNumber: "CHK-12345",
          bankName: "Test Bank",
          dueDate: new Date(),
        },
      });
      await p2.validate();
      console.log("PASSED: Validation successful for complete check payment.");
    } catch (err) {
      console.error("FAILED: Got unexpected error:", err.message);
    }

    // Test 3: Cash payment WITHOUT check details -> Should PASS
    console.log("Test 3: Cash payment WITHOUT check details");
    try {
      const p3 = new Payment({
        code: "PAY-CASH-001",
        customer: mockCustomerId,
        amount: 100,
        method: "cash",
      });
      await p3.validate();
      console.log("PASSED: Validation successful for cash payment.");
    } catch (err) {
      console.error(
        "FAILED: Got unexpected error for cash payment:",
        err.message,
      );
    }

    console.log("All tests completed.");
    process.exit(0);
  } catch (error) {
    console.error("Global Error:", error);
    process.exit(1);
  }
}

testPaymentOffline();
