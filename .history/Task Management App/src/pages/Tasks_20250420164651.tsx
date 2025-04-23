// ==== client/src/pages/Tasks.tsx ====
import { useEffect, useState } from "react";
import axios from "axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const userId = localStorage.getItem("userId");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:3001/tasks", {
      headers: { userid: userId || "" },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    await axios.post(
      "http://localhost:3001/tasks",
      { title, description, completed: false },
      { headers: { userid: userId || "" } }
    );
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:3001/tasks/${id}`, {
      headers: { userid: userId || "" },
    });
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task: any) => (
          <li key={task._id}>
            {task.title} - {task.description}
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Tasks;
