require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

// basic setups
app.use(cors());
app.use(express.json());

// connect to the database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected!'))
  .catch(err => console.log('Error connecting to db:', err));

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST a new task
app.post('/api/tasks', async (req, res) => {
  // just a quick check to make sure they sent a title
  if (!req.body.title) {
    return res.status(400).json({ error: 'Please provide a title' });
  }
  
  const newTask = await Task.create(req.body);
  res.json(newTask);
});

// PUT (update) a task
app.put('/api/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// start the server on port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
