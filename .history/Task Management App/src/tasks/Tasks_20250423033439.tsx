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
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchTasks(storedEmail); // Fetch tasks based on the stored email
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
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null); // Reset error if fetch is successful
    } catch (error) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error fetching tasks from MongoDB:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes
    }
  };

  // Return loading indicator when still loading
  if (isLoading) {
    return <div>Loading...</div>; // Adjust this to match the text your test is looking for
  }

  // Render tasks and other UI elements once loading is finished
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI', background: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'Black', fontSize: '36px' }}>📝 Task Manager</h1>
        <button style={buttonDanger} onClick={handleLogout}>Logout</button>
      </div>

      {/* Display error if there was an issue with fetching tasks */}
      {error && <div role="alert" style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        {error}
      </div>}

      {/* Task creation and display */}
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

      {/* Display tasks after loading */}
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

const buttonSecondary: React.CSSProperties = {
  backgroundColor: '#aaa',
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

