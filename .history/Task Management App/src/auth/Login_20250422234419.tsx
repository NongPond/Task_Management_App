import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .required("กรุณากรอกอีเมล"),
    password: Yup.string()
      .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      .required("กรุณากรอกรหัสผ่าน"),
  });

  type LoginFormValues = {
    email: string;
    password: string;
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      navigate("/tasks");
    } catch (error) {
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">เข้าสู่ระบบ</h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full border px-3 py-2 rounded"
        />
      </div>


            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-3 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}              
            >
              {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

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



  