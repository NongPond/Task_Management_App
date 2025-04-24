import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // ใช้ MemoryRouter สำหรับทดสอบ
import Register from "../auth/Register"; // ปรับตำแหน่งให้ถูกต้อง

describe("Register component", () => {
  it("submits form with valid inputs", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // ใช้ getByLabelText แทน findByLabelText
    const emailInput = screen.getByLabelText(/email/i); 
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    // ตรวจสอบว่า alert ถูกแสดงหรือไม่
    await screen.findByText(/สมัครสมาชิกสำเร็จ/); // ใช้ findByText เพราะคำตอบแสดงในข้อความหลัง submit
  });
});





