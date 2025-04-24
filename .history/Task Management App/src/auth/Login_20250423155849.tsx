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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-200 via-white to-blue-300">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-10 w-full max-w-md animate-fade-in-down">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">เข้าสู่ระบบ</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 focus-within:ring-2 ring-blue-300 transition">
                  <FiMail className="text-gray-400 mr-3" />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent focus:outline-none text-sm"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 focus-within:ring-2 ring-blue-300 transition">
                  <FiLock className="text-gray-400 mr-3" />
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent focus:outline-none text-sm"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-semibold hover:brightness-110 shadow-md transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600 mt-6">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;






  