import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // ห่อหุ้มด้วย BrowserRouter
import Register from "..../auth/Register"; // ตำแหน่งของ Register component

describe("Register component", () => {
  it("submits form with valid inputs", async () => {
    // ห่อ Register component ด้วย BrowserRouter
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const emailInput = await screen.findByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = await screen.findByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    // ตรวจสอบว่า alert ถูกแสดงหรือไม่
    await screen.findByText(/สมัครสมาชิกสำเร็จ/); // ใช้ findByText เพราะคำตอบแสดงในข้อความหลัง submit
  });
});




