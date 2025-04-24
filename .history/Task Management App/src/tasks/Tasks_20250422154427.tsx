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

  // Fetch tasks when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchTasks(storedEmail); // ✅ use the fetch function
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Store tasks in localStorage for persistence
  useEffect(() => {
    if (email) {
      localStorage.setItem(`tasks-${email}`, JSON.stringify(tasks));
    }
  }, [tasks, email]);

  // Fetch tasks from the API
  const fetchTasks = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${email}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks from MongoDB:', error);
    }
  };

  // Create a new task
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

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI', background: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'Black', fontSize: '36px' }}>📝 Task Manager</h1>
        <button style={buttonDanger} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h2>Create New Task</h2>
        <Formik
          initialValues={{
            title: '',
            description: '',
            status: 'pending', // Ensure the status is typed as 'pending' initially
          }}
          validationSchema={Yup.object({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            status: Yup.string()
              .oneOf(['pending', 'in-progress', 'completed'], 'Invalid status') // Validates that the status is one of the defined values
              .required('Status is required'),
          })}
          onSubmit={(values) => {
            // Explicitly cast the status to match the Task type
            handleCreate({
              title: values.title,
              description: values.description,
              status: values.status as 'pending' | 'in-progress' | 'completed', // Cast to correct type
            });
          }}
        >
          {({ values, handleChange, handleBlur, isValid, dirty }) => (
            <Form>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={inputStyle}
                />
                <ErrorMessage
                  name="title"
                  render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} // Custom error rendering
                />
                
                <Field
                  name="description"
                  placeholder="Description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={inputStyle}
                />
                <ErrorMessage
                  name="description"
                  render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} // Custom error rendering
                />
                
                <Field
                  as="select"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={inputStyle}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Field>
                <ErrorMessage
                  name="status"
                  render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} // Custom error rendering
                />
                
                <button
                  style={buttonPrimary}
                  type="submit"
                  disabled={!isValid || !dirty}
                >
                  Create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {tasks.map(task => (
        <div key={task._id} style={cardStyle}>
          <h3 style={{ color: 'black' }}>{task.title}</h3>
          <p style={{ color: 'black' }}>{task.description}</p>
          <span style={{ fontWeight: 'bold', color: statusColor(task.status) }}>{task.status}</span>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button style={buttonSmall}>Edit</button>
            <button style={buttonSmall}>Start</button>
            <button style={buttonSmall}>Complete</button>
            <button style={buttonDanger}>Delete</button>
          </div>
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
