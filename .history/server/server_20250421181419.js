const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // โหลดค่าจาก .env

const app = express();
app.use(express.json());

// ✅ เชื่อมต่อ MongoDB โดยใช้ process.env.MONGO_URI
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ตัวอย่าง route
app.get("/", (req, res) => {
  res.send("Hello Mongo!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

