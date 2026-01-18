const stockService = require("../services/stock.service");

exports.stockIn = async (req, res) => {
  try {
    const result = await stockService.stockIn(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.stockOut = async (req, res) => {
  try {
    const result = await stockService.stockOut(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllStockIn = async (req, res) => {
  try {
    const result = await stockService.getAllStockIn(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllStockOut = async (req, res) => {
  try {
    const result = await stockService.getAllStockOut(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
