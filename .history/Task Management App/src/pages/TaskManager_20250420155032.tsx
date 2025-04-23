import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
};

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });

  const API = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async () => {
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const created = await res.json();
    setTasks([...tasks, created]);
    setNewTask({ title: '', description: '', status: 'pending' });
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button onClick={handleLogout} className="text-red-500 underline">Logout</button>
      </div>

      <div className="mb-4">
        <input
          placeholder="Title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      {tasks.map(task => (
        <div key={task.id} className="mb-2 border p-2 rounded">
          <h2 className="font-semibold">{task.title}</h2>
          <p>{task.description}</p>
          <p className="text-sm text-gray-500">Status: {task.status}</p>
          <button onClick={() => handleDelete(task.id)} className="text-sm text-red-500">Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TaskManager;
