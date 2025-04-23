import { useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState<string[]>(['Task 1', 'Task 2']);

  const deleteTask = (index: number) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Tasks</h1>
      <ul>
        {tasks.map((task, idx) => (
          <li key={idx} className="flex justify-between items-center py-1">
            {task}
            <button onClick={() => deleteTask(idx)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
