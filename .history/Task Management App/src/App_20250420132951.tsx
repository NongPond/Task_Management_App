import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login.tsx';
import TaskList from './tasks/TaskListtxs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

