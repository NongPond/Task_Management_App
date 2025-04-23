const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// ✅ POST: สร้าง task ใหม่
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot save task' });
  }
});

// ✅ GET: ดึง task ทั้งหมดตาม email
router.get('/:email', async (req, res) => {
  try {
    const tasks = await Task.find({ email: req.params.email });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

module.exports = router;
