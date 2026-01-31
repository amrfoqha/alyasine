const mongoose = require("mongoose");
require("dotenv").config();

// Load models
const Customer = require("./models/customer.model");
const CustomerLedger = require("./models/customerLedger.model");

async function verifyBalances() {
  try {
    const username = process.env.ATLAS_USERNAME;
    const password = process.env.ATLAS_PASSWORD;
    const DB_NAME = process.env.DB_NAME;
    const uri = `mongodb+srv://${username}:${password}@testproject.l3pmxx6.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log("Connected to MongoDB for audit.");

    const customers = await Customer.find({ isDeleted: false });
    console.log(`Auditing ${customers.length} customers...\n`);

    let discrepanciesFound = 0;

    for (const customer of customers) {
      // Sum all ledger entries
      const entries = await CustomerLedger.find({
        customer: customer._id,
        isDeleted: false,
      });

      let calculatedBalance = 0;
      entries.forEach((entry) => {
        calculatedBalance += entry.debit || 0;
        calculatedBalance -= entry.credit || 0;
      });

      const storedBalance = customer.balance;
      const difference = calculatedBalance - storedBalance;

      if (Math.abs(difference) > 0.01) {
        discrepanciesFound++;
        console.error(`❌ DISCREPANCY: [${customer.code}] ${customer.name}`);
        console.error(`   Stored Balance:     ${storedBalance}`);
        console.error(`   Calculated Balance: ${calculatedBalance}`);
        console.error(`   Difference:         ${difference}\n`);
      }
    }

    if (discrepanciesFound === 0) {
      console.log(
        "✨ All customer balances match their ledger history perfectly!",
      );
    } else {
      console.log(
        `⚠️ Found ${discrepanciesFound} customers with balance discrepancies.`,
      );
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Audit failed:", error);
    process.exit(1);
  }
}

verifyBalances();
