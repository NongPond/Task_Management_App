const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/myapp");

app.use("/api", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
