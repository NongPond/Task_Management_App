import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Tasks from "./tasks/Tasks";

function App() {
  const email = localStorage.getItem("email");

  return (
    <BrowserRouter>
      <Routes>
        {/* ถ้าไม่ได้ล็อกอิน (ไม่มี email) ส่งไปหน้า Login */}
        <Route
          path="/"
          element={email ? <Navigate to="/tasks" replace /> : <Login />}
        />

        {/* ถ้าผู้ใช้สมัครแล้ว */}
        <Route path="/register" element={<Register />} />

        {/* ถ้าผู้ใช้ล็อกอินแล้ว, ให้เข้าไปที่หน้า tasks */}
        <Route path="/tasks" element={email ? <Tasks /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




