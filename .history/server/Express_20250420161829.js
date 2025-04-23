const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

// สมมุติฐานข้อมูลผู้ใช้
const users = [
  { email: "user@example.com", password: "password123" }, // ตัวอย่างข้อมูล
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email && user.password === password);

  if (user) {
    // ส่ง token กลับไป
    res.json({ token: "1234" });
  } else {
    res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
