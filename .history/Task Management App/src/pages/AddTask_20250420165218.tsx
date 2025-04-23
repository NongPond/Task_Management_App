// AddTask.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/tasks', { title, description, status });
    navigate('/tasks');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">เพิ่มงานใหม่</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">บันทึก</button>
      </form>
    </div>
  );
}

export default AddTask;
