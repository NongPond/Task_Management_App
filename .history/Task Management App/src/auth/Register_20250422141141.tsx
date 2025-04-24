import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("อีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  password: Yup.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร").required("กรุณากรอกรหัสผ่าน"),
});

function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }, { setSubmitting }: any) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        alert("สมัครสมาชิกสำเร็จ! กรุณา Login");
        navigate("/");
      } else {
        alert(data.message || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถสมัครสมาชิกได้");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20 border rounded shadow font-sans">
      <h1 className="text-2xl font-bold mb-6">สมัครสมาชิก</h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full border px-3 py-2 rounded"
                placeholder="example@email.com"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label className="block mb-1">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full border px-3 py-2 rounded"
                placeholder="••••••••"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-60"
            >
              {isSubmitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>

            <p className="text-sm text-center mt-4">
              <Link to="/" className="text-blue-600 underline">
                กลับไปหน้า Login
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;




