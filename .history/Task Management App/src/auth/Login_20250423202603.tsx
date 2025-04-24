import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ เพิ่ม state สำหรับ Error

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        setError("❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
  
      // ตรวจสอบการใช้ navigate ให้ถูกต้อง
      navigate("/tasks");
  
    } catch (error) {
      console.error("Login error:", error);
      setError("⚠️ เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #e0f7fa, #ffffff, #bbdefb)",
        position: "relative",
      }}
    >
      {/* ✅ Alert ตรงกลางด้านบน */}
      {error && (
        <div style={{ position: "absolute", top: "20px", width: "100%", display: "flex", justifyContent: "center", zIndex: 10 }}>
          <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} style={{ maxWidth: 400 }} />
        </div>
      )}

      <div
        style={{
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: "400px",
          animation: "fadeIn 0.6s ease-in-out",
        }}
      >
        <Title level={2} style={{ textAlign: "center", color: "#1677ff" }}>
          เข้าสู่ระบบ
        </Title>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "กรุณากรอกอีเมล" },
              { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่าน" },
              { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" style={{ color: "#1677ff" }}>
            สมัครสมาชิก
          </Link>
        </Text>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Login;
