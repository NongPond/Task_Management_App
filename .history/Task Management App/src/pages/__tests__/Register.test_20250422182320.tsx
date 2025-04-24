import { render, screen, fireEvent } from "@testing-library/react";
import Register from "./auth/Register"; // สมมุติว่า Register เป็น component ที่คุณทดสอบ

describe("Register component", () => {
  it("submits form with valid inputs", async () => {
    // Mock alert function
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<Register />);

    // ใช้ findByLabelText แทน getByLabelText เพื่อให้รองรับการ render ที่เป็น async
    const emailInput = await screen.findByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = await screen.findByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // หาปุ่ม submit และคลิก
    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    // ตรวจสอบว่า alert ถูกเรียก
    await screen.findByText(/สมัครสมาชิกสำเร็จ/);
    expect(alertMock).toHaveBeenCalledWith("สมัครสมาชิกสำเร็จ! กรุณา Login");

    // Restore mock after the test
    alertMock.mockRestore();
  });
});



