import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .required("กรุณากรอกอีเมล"),
      password: Yup.string()
        .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
        .required("กรุณากรอกรหัสผ่าน"),
    }),
    onSubmit: async (values) => {
      try {
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const isExisting = existingUsers.some((user: any) => user.email === values.email);
        if (isExisting) {
          alert("อีเมลนี้ถูกใช้ไปแล้ว");
          return;
        }

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
      }
    },
  });

  return (
    <div className="p-4 max-w-md mx-auto mt-20 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">สมัครสมาชิก</h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-3"
        >
          สมัครสมาชิก
        </button>
      </form>

      <p className="text-sm text-center">
        <Link to="/" className="text-blue-600 underline">
          กลับไปหน้า Login
        </Link>
      </p>
    </div>
  );
}

export default Register;




