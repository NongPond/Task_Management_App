const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("MONGO_URI=mongodb+srv://Pond:Pondza1@pond.z0bxq.mongodb.net/tasksdb?retryWrites=true&w=majority&appName=Pond");

app.use("/api", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
