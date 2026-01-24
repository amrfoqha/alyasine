const Counter = require("../models/counter.model");

module.exports.generateCode = async (type, prefix, session) => {
  const counter = await Counter.findOneAndUpdate(
    { name: type }, // "invoice", "product", "customer"
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session },
  );

  return `${prefix}-${String(counter.seq).padStart(6, "0")}`;
};
