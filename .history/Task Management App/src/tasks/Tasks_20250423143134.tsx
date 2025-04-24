import { useState, useEffect } from 'react';  // นำเข้าแค่ครั้งเดียว

import { useNavigate } from "react-router-dom";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (!token || !storedEmail) {
      navigate("/");
      return;
    }
    setEmail(storedEmail);
    const saved = localStorage.getItem(`tasks-${storedEmail}`); // Fixed this line
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // บันทึก tasks เมื่อมีการเปลี่ยน
  useEffect(() => {
    if (email) {
      localStorage.setItem(`tasks-${email}`, JSON.stringify(tasks)); // Fixed this line
    }
  }, [tasks, email]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const newItem: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
  };

  const toggleComplete = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  };

  const deleteTask = (id: string) => {
    const filtered = tasks.filter((t) => t.id !== id);
    setTasks(filtered);
  };

  const editTaskTitle = (id: string, newTitle: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t
    );
    setTasks(updated);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 จัดการงาน</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="เพิ่มงานใหม่..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          เพิ่ม
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีงาน</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-white shadow rounded px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => editTaskTitle(task.id, e.target.value)}
                  className={`border-b border-transparent focus:border-blue-300 focus:outline-none ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                />
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:underline"
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks; ทำให้ ui เป็นแบบอันนี้โดยยังไม่เชื่อม server 
import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, Task } from './api';
import React from 'react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({ title: '', description: '', status: 'pending' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  const loadTasks = async () => {
    const res = await fetchTasks();
    setTasks(res.data);
  };

  useEffect(() => { loadTasks(); }, []);

  const handleCreate = async () => {
    if (!newTask.title.trim()) return;
    await createTask(newTask);
    setNewTask({ title: '', description: '', status: 'pending' });
    loadTasks();
  };

  const handleUpdate = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
    setEditingId(null);
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    loadTasks();
  };

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Segoe UI, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      position: 'relative',   // ใช้ relative หรือ absolute ตามที่ต้องการ
      left: '750px'           // ขยับ 750px จากขอบซ้าย
    }}>
    
      <h1 style={{ textAlign: 'center', color: 'White' }}>📝 Task Manager</h1>
      <div style={{ marginBottom: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: '10 px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Create New Task</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            placeholder="Title"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            style={{ ...inputStyle, width: '300px' }} 
          />
          <input
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            style={{ ...inputStyle, width: '300px' }} 
          />
          <select
            value={newTask.status}
            onChange={e => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
            style={{ ...inputStyle, width: '300px' }} 
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button style={buttonPrimary} onClick={handleCreate}>Create</button>
        </div>
      </div>

      {tasks.map(task => (
        <div key={task._id} style={cardStyle}>
          {editingId === task._id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                value={editedTask.title ?? task.title}
                onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                style={inputStyle}
              />
              <input
                value={editedTask.description ?? task.description}
                onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
                style={inputStyle}
              />
              <select
                value={editedTask.status ?? task.status}
                onChange={e => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                style={inputStyle}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={buttonPrimary} onClick={() => handleUpdate(task._id!, editedTask)}>Save</button>
                <button style={buttonSecondary} onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h3 style={{ color: 'black' }}>{task.title}</h3> 
              <p style={{ color: 'black' }}>{task.description}</p> 
              <span style={{ fontWeight: 'bold', color: statusColor(task.status) }}>{task.status}</span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button style={buttonSmall} onClick={() => {
                  setEditingId(task._id!);
                  setEditedTask(task);
                }}>Edit</button>
                <button style={buttonSmall} onClick={() => handleUpdate(task._id!, { status: 'in-progress' })}>Start</button>
                <button style={buttonSmall} onClick={() => handleUpdate(task._id!, { status: 'completed' })}>Complete</button>
                <button style={buttonDanger} onClick={() => handleDelete(task._id!)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// 🎨 สไตล์ต่าง ๆ
const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  flex: 1,
  minWidth: '150px',
};

const buttonPrimary: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
};

const buttonSecondary: React.CSSProperties = {
  backgroundColor: '#aaa',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
};

const buttonDanger: React.CSSProperties = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
  cursor: 'pointer',
};

const buttonSmall: React.CSSProperties = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '0.4rem 0.7rem',
  borderRadius: '6px',
  cursor: 'pointer',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '1rem',
  marginBottom: '1rem',
  borderRadius: '10px',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
};

function statusColor(status: string) {
  switch (status) {
    case 'pending': return '#f39c12';
    case 'in-progress': return '#2980b9';
    case 'completed': return '#27ae60';
    default: return '#7f8c8d';
  }
}




