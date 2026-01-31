const User = require("../models/user.model");
const RefreshToken = require("../models/refresh_token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString("hex");

  await RefreshToken.create({
    user: userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
};

module.exports.register = async (req, res) => {
  const { name, password, confirmPassword } = req.body;
  console.log(req.body);

  const existingUser = await User.findOne({ name: name.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    password,
    confirmPassword,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user._id);

  res.status(201).json({
    accessToken,
    refreshToken,
    user,
  });
};

module.exports.login = async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name: name.toLowerCase() });
  if (!user) {
    return res.status(400).json({
      message:
        "Invalid name or password | اسم المستخدم او كلمة المرور غير صحيحة",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message:
        "Invalid name or password | اسم المستخدم او كلمة المرور غير صحيحة",
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user._id);
  res.json({
    accessToken,
    refreshToken,
    user,
  });
};

module.exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  const accessToken = jwt.sign(
    { id: storedToken.user },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ accessToken });
};

module.exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;

    await RefreshToken.deleteMany({ user: userId });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};
