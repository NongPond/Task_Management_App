import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "pending",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  useEffect(() => {
    const saved = localStorage.getItem("tasks-ui");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks-ui", JSON.stringify(tasks));
  }, [tasks]);

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    const item: Task = {
      id: Date.now().toString(),
      ...newTask,
    };
    setTasks([...tasks, item]);
    setNewTask({ title: "", description: "", status: "pending" });
  };

  const handleUpdate = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", color: "white" }}>📝 Task Manager</h1>
      <div style={formContainer}>
        <h2>Create New Task</h2>
        <div style={formGroup}>
          <input
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={inputStyle}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task["status"] })}
            style={inputStyle}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button style={buttonPrimary} onClick={handleCreate}>Create</button>
        </div>
      </div>

      {tasks.map((task) => (
        <div key={task.id} style={cardStyle}>
          {editingId === task.id ? (
            <>
              <input
                value={editedTask.title ?? task.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                style={inputStyle}
              />
              <input
                value={editedTask.description ?? task.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                style={inputStyle}
              />
              <select
                value={editedTask.status ?? task.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task["status"] })}
                style={inputStyle}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button style={buttonPrimary} onClick={() => handleUpdate(task.id, editedTask)}>Save</button>
                <button style={buttonSecondary} onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span style={{ color: statusColor(task.status), fontWeight: "bold" }}>{task.status}</span>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button style={buttonSmall} onClick={() => {
                  setEditingId(task.id);
                  setEditedTask(task);
                }}>Edit</button>
                <button style={buttonSmall} onClick={() => handleUpdate(task.id, { status: "in-progress" })}>Start</button>
                <button style={buttonSmall} onClick={() => handleUpdate(task.id, { status: "completed" })}>Complete</button>
                <button style={buttonDanger} onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// 🌈 Styles
const containerStyle: React.CSSProperties = {
  padding: "2rem",
  fontFamily: "Segoe UI, sans-serif",
  maxWidth: "800px",
  margin: "0 auto",
};

const formContainer: React.CSSProperties = {
  marginBottom: "2rem",
  background: "#f9f9f9",
  padding: "1rem",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const formGroup: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minWidth: "150px",
  flex: 1,
};

const buttonPrimary = {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
};

const buttonSecondary = {
  backgroundColor: "#aaa",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
};

const buttonDanger = {
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  cursor: "pointer",
};

const buttonSmall = {
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  padding: "0.4rem 0.7rem",
  borderRadius: "6px",
  cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "10px",
  boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
};

const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "#f39c12";
    case "in-progress":
      return "#2980b9";
    case "completed":
      return "#27ae60";
    default:
      return "#7f8c8d";
  }
};





