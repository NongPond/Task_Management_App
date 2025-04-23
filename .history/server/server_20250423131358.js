const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// 👇 Home route with links
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Task Management API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/auth">/api/auth</a> – Auth routes</li>
      <li><a href="/api/tasks">/api/tasks</a> – Task routes</li>
    </ul>
  `);
});

// ✨ import route
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✨ import task routes
const taskRoutes = require("./routes/task");
app.use("/api/tasks", taskRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



