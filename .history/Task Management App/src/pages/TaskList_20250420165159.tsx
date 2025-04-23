// TaskList.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks');
    setTasks(res.data);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">งานทั้งหมด</h1>
      <Link to="/tasks/add" className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block">เพิ่มงาน</Link>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="border p-2 my-2">
            <h2 className="font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <p className="text-sm text-gray-600">{task.status}</p>
            <div className="mt-2">
              <Link to={`/tasks/edit/${task._id}`} className="text-blue-500 mr-2">แก้ไข</Link>
              <button onClick={() => handleDelete(task._id)} className="text-red-500">ลบ</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;