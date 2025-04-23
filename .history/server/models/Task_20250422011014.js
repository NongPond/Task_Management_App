const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: stringม
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  email: String,
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);



