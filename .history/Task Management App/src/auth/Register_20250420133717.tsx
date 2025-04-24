import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (email && password) {
      // บันทึกข้อมูลผู้ใช้ใน localStorage
      const userData = { email, password };
      localStorage.setItem("user", JSON.stringify(userData));
      alert("สมัครสมาชิกสำเร็จ! กรุณา Login");
      navigate("/");
    } else {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">สมัครสมาชิก</h1>

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleRegister}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        สมัครสมาชิก
      </button>
    </div>
  );
}

export default Register;
