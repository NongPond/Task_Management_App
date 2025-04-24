import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiMail, FiLock } from "react-icons/fi";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">เข้าสู่ระบบ</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center border rounded-md px-3 py-2">
                  <FiMail className="text-gray-400 mr-2" />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    className="w-full outline-none text-sm"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <div className="flex items-center border rounded-md px-3 py-2">
                  <FiLock className="text-gray-400 mr-2" />
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full outline-none text-sm"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition text-sm ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm mt-4">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;





  