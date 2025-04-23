import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // mock initial data (load from localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // update localStorage on change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const newItem: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
  };

  const toggleComplete = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  };

  const deleteTask = (id: string) => {
    const filtered = tasks.filter((t) => t.id !== id);
    setTasks(filtered);
  };

  const editTaskTitle = (id: string, newTitle: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t
    );
    setTasks(updated);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 จัดการงาน</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="เพิ่มงานใหม่..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          เพิ่ม
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีงาน</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-white shadow rounded px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => editTaskTitle(task.id, e.target.value)}
                  className={`border-b border-transparent focus:border-blue-300 focus:outline-none ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                />
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:underline"
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;

  