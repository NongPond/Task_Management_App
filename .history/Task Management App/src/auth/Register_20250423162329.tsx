import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import "./Register.css"; // นำเข้าไฟล์ CSS animation

const { Title, Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("สมัครสมาชิกสำเร็จ! กรุณา Login");
        navigate("/");
      } else {
        message.error(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <Title level={2} style={{ textAlign: "center", color: "#4caf50" }}>
          สมัครสมาชิก
        </Title>

        <Form
          name="register"
          layout="vertical"
          onFinish={handleRegister}
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
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/" style={{ color: "#4caf50" }}>
            กลับไปหน้า Login
          </Link>
        </Text>
      </div>
    </div>
  );
}

export default Register;




