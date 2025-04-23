const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

// Create a task
app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  const newTask = { id: uuidv4(), title, description, status };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  task ? res.json(task) : res.status(404).send('Task not found');
});

// Update a task
app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).send('Task not found');

  const { title, description, status } = req.body;
  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;

  res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

