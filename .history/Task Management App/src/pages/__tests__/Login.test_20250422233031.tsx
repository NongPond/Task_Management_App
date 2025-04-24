import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "..../Login"; // ค่าที่ต้องใช้จากที่ตั้งของคอมโพเนนต์ Login
import { BrowserRouter as Router } from "react-router-dom";

test("renders login form and validates fields", async () => {
  render(
    <Router>
      <Login />
    </Router>
  );

  // กรอกอีเมลที่ไม่ถูกต้อง
  const emailInput = screen.getByLabelText(/email/i);
  fireEvent.change(emailInput, { target: { value: "invalid-email" } });

  // กรอกรหัสผ่านที่สั้นเกินไป
  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(passwordInput, { target: { value: "123" } });

  // คลิกปุ่ม Login
  const loginButton = screen.getByRole("button", { name: /login/i });
  fireEvent.click(loginButton);

  // รอให้มีข้อผิดพลาดจากการกรอกข้อมูล
  await waitFor(() => {
    // ตรวจสอบข้อความผิดพลาดสำหรับอีเมล
    const emailError = screen.getByText("รูปแบบอีเมลไม่ถูกต้อง");
    expect(emailError).toBeInTheDocument();

    // ตรวจสอบข้อความผิดพลาดสำหรับรหัสผ่าน
    const passwordError = screen.getByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    expect(passwordError).toBeInTheDocument();
  });
});

test("successful login", async () => {
  render(
    <Router>
      <Login />
    </Router>
  );

  // กรอกอีเมลและรหัสผ่านที่ถูกต้อง
  const emailInput = screen.getByLabelText(/email/i);
  fireEvent.change(emailInput, { target: { value: "valid@example.com" } });

  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(passwordInput, { target: { value: "validpassword" } });

  // คลิกปุ่ม Login
  const loginButton = screen.getByRole("button", { name: /login/i });
  fireEvent.click(loginButton);

  // รอการตอบกลับจาก API
  await waitFor(() => {
    // ตรวจสอบว่า localStorage มีข้อมูลหรือไม่
    expect(localStorage.getItem("token")).not.toBeNull();
    expect(localStorage.getItem("email")).toBe("valid@example.com");
  });
});
