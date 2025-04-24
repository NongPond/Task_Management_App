import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Tasks from "./tasks/tasks";
import AddTask from "./tasks/AddTask"; // 👈 นำเข้า component ใหม่

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/add" element={<AddTask />} /> {/* 👈 เพิ่ม route นี้ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;




