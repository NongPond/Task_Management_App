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
  const [loading, setLoading] = useState(true); // New loading state
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

  const fetchTasks = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${email}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks from MongoDB:', error);
    } finally {
      setLoading(false); // Hide the loading spinner after data is fetched
    }
  };

  const handleCreate = async () => {
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!newTask.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, email }),
      });

      const created = await res.json();
      setTasks(prev => [...prev, created]);
      setNewTask({ title: '', description: '', status: 'pending' });
      setError(null);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email'); // Remove email from localStorage
    navigate('/'); // Navigate to the login page
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI', background: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'Black', fontSize: '36px' }}>📝 Task Manager</h1>
        <button style={buttonDanger} onClick={handleLogout}>Logout</button>
      </div>

      {loading ? (
        <div role="alert" style={{ color: 'gray', fontSize: '18px' }}>Loading...</div>
      ) : (
        <>
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
              <button style={buttonPrimary} onClick={handleCreate}>Create</button>
            </div>
          </div>

          {tasks.map(task => (
            <div key={task._id} style={cardStyle}>
              <h3 style={{ color: 'black' }}>{task.title}</h3>
              <p style={{ color: 'black' }}>{task.description}</p>
              <span style={{ fontWeight: 'bold', color: statusColor(task.status) }}>{task.status}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

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






