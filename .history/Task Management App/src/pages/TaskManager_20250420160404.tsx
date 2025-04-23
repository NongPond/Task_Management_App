import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // ดึงข้อมูล tasks จาก API เมื่อ component โหลด
  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold">Task Manager</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mt-2">
            <div className="border p-4">
              <h2 className="font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;

