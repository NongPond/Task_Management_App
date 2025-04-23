import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../../auth/Register";

describe("Register component", () => {
  it("displays error message if email is invalid", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // พิมพ์อีเมลที่ไม่ถูกต้อง
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    // พิมพ์รหัสผ่านให้ผ่าน validation
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "12345678" } });

    // คลิกปุ่มสมัครสมาชิก
    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    // รอข้อความ error แสดง
    const error = await screen.findByText((_, element) =>
        element?.textContent === "รูปแบบอีเมลไม่ถูกต้อง"
      );
      
    expect(error).toBeInTheDocument();
  });
});














