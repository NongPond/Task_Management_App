import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

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
    setErrorMessage("");  // Reset error message before submit
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
        navigate("/"); // Navigate to login page
      } else {
        setErrorMessage(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false); // Allow submit button to be enabled
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">สมัครสมาชิก</h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
        validateOnBlur
        validateOnChange
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            {/* Display any general error messages */}
            {errorMessage && (
              <div
                className="text-red-500 text-sm text-center mb-4"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {/* Email input field */}
            <div className="mb-4">
      <label htmlFor="email" className="block mb-1">
        Email
      </label>
      <Field
        id="email"
        name="email"
        type="email"
        className="w-full border px-3 py-2 rounded"
      />
      {/* เพิ่ม ErrorMessage และ data-testid */}
      <ErrorMessage name="email">
        {msg => (
          <div data-testid="email-error" className="text-red-500 text-sm mt-1">
            {msg}
          </div>
    )}
  </ErrorMessage>
</div>

  )}
</div>

            {/* Password input field */}
            <div className="mb-6">
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="w-full border px-3 py-2 rounded"
              />
              {/* Show password error message */}
              {touched.password && errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-3 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Link back to Login page */}
      <p className="text-sm text-center">
        <Link to="/" className="text-blue-600 underline">
          กลับไปหน้า Login
        </Link>
      </p>
    </div>
  );
}

export default Register;

