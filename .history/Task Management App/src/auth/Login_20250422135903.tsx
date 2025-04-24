import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณากรอกอีเมล'),
      password: Yup.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').required('กรุณากรอกรหัสผ่าน'),
    }),
    onSubmit: (values) => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const matchedUser = users.find((user: any) =>
        user.email === values.email && user.password === values.password
      );

      if (matchedUser) {
        localStorage.setItem("token", "1234");
        localStorage.setItem("email", values.email);
        navigate("/tasks");
      } else {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    },
  });

  return (
    <div className="p-4 max-w-md mx-auto mt-20 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">เข้าสู่ระบบ</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-3"
        >
          Login
        </button>
      </form>

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




  