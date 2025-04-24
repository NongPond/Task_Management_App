import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const matchedUser = users.find(
      (user: any) => user.email === email && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem("token", "1234");
      localStorage.setItem("email", email);
      navigate("/tasks");
    } else {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">เข้าสู่ระบบ</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-3"
      >
        Login
      </button>

      <p className="text-sm text-center">
        ยังไม่มีบัญชี?{" "}
        <Link to="/register" className="text-blue-600 underline">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}

export default Login;


  