const CustomerLedger = require("../models/customerLedger.model");

exports.addLedgerEntry = async ({
  customer,
  type,
  refId,
  debit = 0,
  credit = 0,
  balanceAfter,
  description,
  session,
}) => {
  return await CustomerLedger.create(
    [
      {
        customer,
        type,
        refId,
        debit,
        credit,
        balanceAfter,
        description,
      },
    ],
    session ? { session } : {},
  );
};
