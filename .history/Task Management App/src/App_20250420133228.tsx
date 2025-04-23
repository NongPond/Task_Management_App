import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Tasks from "./tasks/Tasks.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


