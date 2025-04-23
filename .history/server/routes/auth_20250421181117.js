// server/routes/auth.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// POST /api/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  const user = new User({ email, password });
  await user.save();
  res.status(201).json({ message: "Registered successfully" });
});

module.exports = router;
