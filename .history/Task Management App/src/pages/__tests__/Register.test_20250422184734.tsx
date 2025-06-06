import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // ใช้ MemoryRouter สำหรับทดสอบ
import Register from "../../auth/Register"; // ปรับ path ให้ตรงกับที่คุณใช้

describe("Register component", () => {
  it("submits form with valid inputs", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // ใช้ findByLabelText เพื่อหาฟิลด์อีเมล
    const emailInput = await screen.findByLabelText(/Email/i); // เปลี่ยนเป็น "Email" แทน "อีเมล
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // ใช้ getByLabelText เพื่อหาฟิลด์รหัสผ่าน
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // หาปุ่ม submit และคลิก
    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    // ตรวจสอบว่ามี alert แสดงขึ้นหลังจาก submit
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("สมัครสมาชิกสำเร็จ! กรุณา Login"));
  });

  it("displays error message if email is invalid", async () => {
    render(<Register />);
  
    const emailInput = await screen.findByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  
    const submitButton = screen.getByText(/สมัครสมาชิก/i);
    fireEvent.click(submitButton);
  
    // ค้นหาข้อความข้อผิดพลาดจาก ErrorMessage
    const emailError = await screen.findByText(/รูปแบบอีเมลไม่ถูกต้อง/i);
    expect(emailError).toBeInTheDocument();
  });
  










