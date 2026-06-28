import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// Use Vercel's backend route prefix for production, localhost for development
const API_URL = import.meta.env.PROD 
  ? '/_/backend/api/tasks' 
  : 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!title) return alert('Please enter a title');

    axios.post(API_URL, { title, description })
      .then(res => {
        setTasks([res.data, ...tasks]);
        setTitle('');
        setDescription('');
      });
  };

  const toggleStatus = (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    axios.put(`${API_URL}/${task._id}`, { ...task, status: newStatus })
      .then(res => {
        setTasks(tasks.map(t => t._id === task._id ? res.data : t));
      });
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTasks(tasks.filter(t => t._id !== id));
      });
  };

  return (
    <div className="container">
      <h1>Task Tracker</h1>
      
      <form onSubmit={addTask} className="form">
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Task title" 
        />
        <input 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Task description" 
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="list">
        {tasks.map(task => (
          <div key={task._id} className={`task ${task.status}`}>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className="actions">
              <button onClick={() => toggleStatus(task)}>
                {task.status === 'pending' ? 'Mark Done' : 'Undo'}
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
