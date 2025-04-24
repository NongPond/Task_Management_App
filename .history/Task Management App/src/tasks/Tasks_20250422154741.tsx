import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type Task = {
  _id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
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
      const response = await fetch(`http://localhost:5000/api/tasks/${email}`); // ✅ เปลี่ยนตรงนี้
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks from MongoDB:', error);
    }
  };

  const handleCreate = async (newTask: Task) => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, email }),
      });

      const created = await res.json();
      setTasks(prev => [...prev, created]);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/');
  };

  // Yup schema for validation
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    status: Yup.string().oneOf(['pending', 'in-progress', 'completed'], 'Invalid status').required('Status is required'),
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI', background: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'Black', fontSize: '36px' }}>📝 Task Manager</h1>
        <button style={buttonDanger} onClick={handleLogout}>Logout</button>
      </div>

      <Formik
        initialValues={{ title: '', description: '', status: 'pending' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleCreate(values);  // Submit to API
        }}
      >
        {({ isValid, dirty }) => (
          <Form style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem' }}>
            <h2>Create New Task</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Field
                name="title"
                placeholder="Title"
                style={inputStyle}
              />
              <ErrorMessage name="title" component="div" style={errorMessageStyle} />

              <Field
                name="description"
                placeholder="Description"
                style={inputStyle}
              />
              <ErrorMessage name="description" component="div" style={errorMessageStyle} />

              <Field as="select" name="status" style={inputStyle}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Field>
              <ErrorMessage name="status" component="div" style={errorMessageStyle} />

              <button
                type="submit"
                disabled={!isValid || !dirty}
                style={buttonPrimary}
              >
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {tasks.map(task => (
        <div key={task._id} style={cardStyle}>
          <h3 style={{ color: 'black' }}>{task.title}</h3>
          <p style={{ color: 'black' }}>{task.description}</p>
          <span style={{ fontWeight: 'bold', color: statusColor(task.status) }}>{task.status}</span>
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

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '1rem',
  marginBottom: '1rem',
  borderRadius: '10px',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
};

const errorMessageStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '0.9rem',
};

function statusColor(status: string) {
  switch (status) {
    case 'pending': return '#f39c12';
    case 'in-progress': return '#2980b9';
    case 'completed': return '#27ae60';
    default: return '#7f8c8d';
  }
}




