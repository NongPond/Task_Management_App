import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Input, Select, Card, Typography, Space, Alert, Row, Col, Spin, Divider, Tag
} from 'antd';
import {
  LogoutOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined
} from '@ant-design/icons';
import { message } from 'antd';



const { Title, Text } = Typography;
const { Option } = Select;

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
      navigate('/login'); // <-- ถ้าไม่มี email จะโดนเตะกลับ
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
      const response = await fetch(`http://localhost:5000/api/tasks/user/${email}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (error) {
      setError('No additional information has been added yet.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTask.title.trim()) {
      setFormError('Title is required');
      return;
    }
    setFormError(null);
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, email }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const created = await res.json();
      setTasks(prev => [...prev, created]);
      setNewTask({ title: '', description: '', status: 'pending' });
    } catch (err) {
      setError('Failed to create task. Please try again later.');
    }
  };

  const handleUpdate = async (_id: string, updates: Partial<Task>) => {
    const originalTask = tasks.find(t => t._id === _id);
    if (!originalTask?.title?.trim() && !updates.title?.trim()) {
      setFormError('Cannot edit task without a title.');
      return;
    }
  
    if (updates.title !== undefined && !updates.title.trim()) {
      setFormError('Title is required');
      return;
    }
  
    setFormError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated: Task = await res.json();
      setTasks(prev => prev.map(t => (t._id === _id ? updated : t)));
      setEditingId(null);
    console.log('done update'); // เช็คว่ามาถึงนี้มั้ย
    message.success('อัปเดตงานสำเร็จแล้ว!');

    } catch (err) {
      console.error('Error updating task:', err);
      message.error('เกิดข้อผิดพลาดในการอัปเดต');
    }
  };
  

  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t._id !== _id));
    } catch (err) {
      setError('Failed to delete task. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/');
  };

  if (loading) return <Spin tip="Loading tasks..." fullscreen />;

  const getStatusTag = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Tag color="orange">Pending</Tag>;
      case 'in-progress':
        return <Tag color="blue">In Progress</Tag>;
      case 'completed':
        return <Tag color="green">Completed</Tag>;
    }
  };

  return (
    <div style={{ padding: '3rem', maxWidth: 1000, margin: '0 auto', background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Title level={2}>📝 Task Manager</Title>
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
      </Row>

      {error && <Alert type="error" message={error} showIcon closable style={{ marginBottom: 16 }} />}
      {formError && <Alert type="error" message={formError} showIcon closable style={{ marginBottom: 16 }} />}

      <Card title="🎯 Create a New Task" style={{ marginBottom: 32, background: '#fefefe' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="Title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Col>
            <Col span={8}>
              <Input
                placeholder="Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
            </Col>
            <Col span={8}>
              <Select
                value={newTask.status}
                onChange={val => setNewTask({ ...newTask, status: val })}
                style={{ width: '100%' }}
              >
                <Option value="pending">Pending</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Col>
          </Row>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Task
          </Button>
        </Space>
      </Card>

      <Divider>📋 Your Tasks</Divider>

      {tasks.map(task => (
        <Card
          key={task._id}
          style={{ marginBottom: 20, background: '#ffffff' }}
          title={editingId === task._id ? 'Editing Task' : task.title}
          extra={getStatusTag(task.status)}
        >
          {editingId === task._id ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                value={editedTask.title ?? task.title}
                onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
              />
              <Input
                value={editedTask.description ?? task.description}
                onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
              />
              <Select
                value={editedTask.status ?? task.status}
                onChange={val => setEditedTask({ ...editedTask, status: val })}
              >
                <Option value="pending">Pending</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleUpdate(task._id!, editedTask)}
                >
                  Save
                </Button>
                <Button onClick={() => setEditingId(null)}>Cancel</Button>
              </Space>
            </Space>
          ) : (
            <>
              <Text>{task.description}</Text>
              <br /><br />
              <Space wrap>
                <Button icon={<EditOutlined />} onClick={() => { setEditingId(task._id!); setEditedTask(task); }}>
                  Edit
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(task._id!)}>
                  Delete
                </Button>
              </Space>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}








