import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../Register"; // ใส่ path ที่ถูกต้อง
import { BrowserRouter as Router } from "react-router-dom";

const setup = () => {
  render(
    <Router>
      <Register />
    </Router>
  );
};

describe("Register Form", () => {
  it("submits form with valid inputs", async () => {
    setup();

    // ใช้ findByLabelText แทน getByLabelText เพื่อให้รองรับการ render ที่เป็น async
    const emailInput = await screen.findByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = await screen.findByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    // รอการตอบสนองจาก fetch (สามารถปรับให้เหมาะสมกับการใช้งานจริง)
    await waitFor(() => expect(submitButton).toHaveTextContent("กำลังสมัครสมาชิก..."));
  });
});

