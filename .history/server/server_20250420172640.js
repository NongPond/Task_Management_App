// ==== server/server.js ====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://Pond:<db_password>@pond.z0bxq.mongodb.net/?retryWrites=true&w=majority&appName=Pond");

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User exists" });
  const user = new User({ email, password });
  await user.save();
  res.status(201).json({ message: "Registered" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ token: "mock-token", userId: user._id });
});

// Middleware
const auth = (req, res, next) => {
  const userId = req.headers["userid"];
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  req.userId = userId;
  next();
};

// Tasks CRUD
app.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.userId });
  await task.save();
  res.status(201).json(task);
});

app.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

app.get("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
});

app.patch("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(task);
});

app.delete("/tasks/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));



