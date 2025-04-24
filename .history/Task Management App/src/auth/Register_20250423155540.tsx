import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FiMail, FiLock } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .required("กรุณากรอกอีเมล"),
    password: Yup.string()
      .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      .required("กรุณากรอกรหัสผ่าน"),
  });

  type RegisterFormValues = {
    email: string;
    password: string;
  };

  const handleRegister = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    setErrorMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("สมัครสมาชิกสำเร็จ! กรุณา Login");
        navigate("/");
      } else {
        setErrorMessage(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 font-sans">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-10 w-full max-w-md animate-fade-in-down">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">สมัครสมาชิก</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
          validateOnBlur
          validateOnChange
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {errorMessage && (
                <div className="text-red-500 text-sm text-center" role="alert">
                  {errorMessage}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 focus-within:ring-2 ring-green-300 transition">
                  <FiMail className="text-gray-400 mr-3" />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent focus:outline-none text-sm"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-1">
                  Password
                </label>
                <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50 focus-within:ring-2 ring-green-300 transition">
                  <FiLock className="text-gray-400 mr-3" />
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent focus:outline-none text-sm"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:brightness-110 shadow-md transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600 mt-6">
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/" className="text-green-600 font-medium hover:underline">
            กลับไปหน้า Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;


