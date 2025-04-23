// EditTask.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditTask() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/tasks/${id}`).then(res => {
      const { title, description, status } = res.data;
      setTitle(title);
      setDescription(description);
      setStatus(status);
    });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.patch(`http://localhost:5000/tasks/${id}`, { title, description, status });
    navigate('/tasks');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">แก้ไขงาน</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="หัวข้องาน"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="รายละเอียด"
          className="w-full border px-3 py-2 rounded"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="pending">รอดำเนินการ</option>
          <option value="completed">เสร็จสิ้น</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">อัปเดต</button>
      </form>
    </div>
  );
}

export default EditTask;
