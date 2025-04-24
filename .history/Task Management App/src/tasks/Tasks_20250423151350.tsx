import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Task = {
  _id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    description: '',
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchTasks(storedEmail);
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  

  useEffect(() => {
    if (email) {
      localStorage.setItem(`tasks-${email}`, JSON.stringify(tasks));
    }
  }, [tasks, email]);

  const fetchTasks = async (email: string) => {
    setLoading(true);
    try {
      console.log('Fetching tasks for email:', email); // ตรวจสอบค่า email
      const response = await fetch(`http://localhost:5000/api/tasks/user/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      console.log('Fetched tasks:', data); // ตรวจสอบข้อมูลที่ดึงมา
      setTasks(data);
      setError(null);
    } catch (error) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error fetching tasks from MongoDB:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreate = async () => {
    if (!newTask.title.trim()) {
      setFormError('Title is required');
      return;
    }
  
    setFormError(null); // เคลียร์ error เดิมถ้ามี
  
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, email }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to create task');
      }
  
      const created = await res.json();
      setTasks(prev => [...prev, created]);
      setNewTask({ title: '', description: '', status: 'pending' });
      setError(null); // clear error ถ้าสำเร็จ
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again later.');
    }
  };
  
  

  const handleUpdate = async (_id: string, updates: Partial<Task>) => {
    setFormError(null); // เคลียร์ error เก่าออก
  
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated: Task = await res.json();
      setTasks(prev => prev.map(t => (t._id === _id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };
  

  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${_id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(t => t._id !== _id));
    } catch (err) {
      setError('Failed to delete task. Please try again later.');
      console.error('Error deleting task:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;

  if (!loading && tasks.length === 0 && !error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Segoe UI' }}>
        <p>No tasks found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI', background: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'Black', fontSize: '36px' }}>📝 Task Manager</h1>
        <button
          style={buttonDanger}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {error && <div role="alert" style={errorStyle}>
        {error}
      </div>}

      {formError && <div role="alert" style={errorStyle}>
        {formError}
      </div>}

      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h2>Create New Task</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            placeholder="Title"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            style={inputStyle}
          />
          <select
            value={newTask.status}
            onChange={e => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
            style={inputStyle}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            style={buttonPrimary}
            onClick={handleCreate}
            aria-label="Create task"
          >
            Create
          </button>
        </div>
      </div>

      {tasks.map(task => (
        <div key={task._id} style={cardStyle}>
          {editingId === task._id ? (
            <>
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
            </>
          ) : (
            <>
              <h3 style={{ color: 'black' }}>{task.title}</h3>
              <p style={{ color: 'black' }}>{task.description}</p>
              <span style={{ fontWeight: 'bold', color: statusColor(task.status) }}>{task.status}</span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button style={buttonSmall} onClick={() => { setEditingId(task._id!); setEditedTask(task); }}>Edit</button>
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

// 💅 Styles
const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  minWidth: '150px',
};

const buttonPrimary: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const buttonDanger: React.CSSProperties = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const buttonSmall: React.CSSProperties = {
  backgroundColor: '#3498db',
  color: 'white',
  padding: '0.4rem 0.7rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const buttonSecondary: React.CSSProperties = {
  backgroundColor: '#aaa',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '1rem',
  marginBottom: '1rem',
  borderRadius: '10px',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
};

const errorStyle: React.CSSProperties = {
  background: '#f8d7da',
  color: '#721c24',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
};

const statusColor = (status: 'pending' | 'in-progress' | 'completed') => {
  switch (status) {
    case 'pending': return 'orange';
    case 'in-progress': return 'blue';
    case 'completed': return 'green';
    default: return 'gray';
  }
};





