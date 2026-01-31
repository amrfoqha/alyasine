const User = require("../models/user.model");
module.exports.findUser = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
