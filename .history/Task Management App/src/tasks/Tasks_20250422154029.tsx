import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type Task = {
  _id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchTasks(storedEmail); // ✅ ใช้ฟังก์ชันที่กำหนดไว้
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
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${email}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks from MongoDB:', error);
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('กรุณากรอกชื่อ task'),
    description: Yup.string().required('กรุณากรอกรายละเอียด'),
    status: Yup.string().required('กรุณาเลือกสถานะ task'),
  });

  const handleCreate = async (values: Task) => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, email }),
      });

      const created = await res.json();
      setTasks(prev => [...prev, created]);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdate = async (_id: string, updates: Partial<Task>) => {
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
      await fetch(`http://localhost:5000/api/tasks/${_id}`, {
        method: 'DELETE',
      });
      setTasks(prev => prev.filter(t => t._id !== _id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI', background: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'Black', fontSize: '36px' }}>📝 Task Manager</h1>
        <button style={buttonDanger} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h2>Create New Task</h2>
        <Formik
          initialValues={{ title: '', description: '', status: 'pending' }}
          validationSchema={validationSchema}
          onSubmit={handleCreate}
        >
          <Form>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Field
                name="title"
                placeholder="Title"
                style={inputStyle}
              />
              <ErrorMessage name="title" component="div" style={{ color: 'red' }} />
              <Field
                name="description"
                placeholder="Description"
                style={inputStyle}
              />
              <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
              <Field as="select" name="status" style={inputStyle}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Field>
              <ErrorMessage name="status" component="div" style={{ color: 'red' }} />
              <button style={buttonPrimary} type="submit">Create</button>
            </div>
          </Form>
        </Formik>
      </div>

      {tasks.map(task => (
        <div key={task._id} style={cardStyle}>
          {editingId === task._id ? (
            <Formik
              initialValues={{ ...task, status: task.status }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleUpdate(task._id!, values)}
            >
              <Form>
                <Field
                  name="title"
                  style={inputStyle}
                />
                <Field
                  name="description"
                  style={inputStyle}
                />
                <Field as="select" name="status" style={inputStyle}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Field>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={buttonPrimary} type="submit">Save</button>
                  <button style={buttonSecondary} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </Form>
            </Formik>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
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




