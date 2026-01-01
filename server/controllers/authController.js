const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret123", {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};

const Task = require("../models/Task");

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  // Tasks will be deleted automatically via User model middleware
  await user.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  deleteUser,
};
