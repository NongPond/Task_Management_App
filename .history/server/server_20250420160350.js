const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

let tasks = []; // เก็บ task ที่เพิ่มเข้าไป

app.use(cors());
app.use(express.json());

// GET: ดึงข้อมูลทั้งหมดของ tasks
app.get('/tasks', (req, res) => {
  res.json(tasks); // ส่ง tasks ที่เก็บไว้ในตัวแปร
});

// POST: เพิ่ม task ใหม่
app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  const newTask = { id: Date.now().toString(), title, description, status };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


