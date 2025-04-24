import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from '<div styleName={} />
<div styleName={} />Register'; // ปรับ import ตามที่คุณใช้งาน

describe('Register component', () => {
  // Mock window.alert ก่อนการทดสอบ
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  // ฟังก์ชันที่ใช้คืนค่าหลังจากการทดสอบเสร็จ
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ทดสอบการส่งข้อมูลที่ถูกต้อง
  it("submits form with valid inputs", async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByText(/สมัครสมาชิก/i);
    fireEvent.click(submitButton);

    // รอให้แสดง alert หลังจาก submit
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("สมัครสมาชิกสำเร็จ! กรุณา Login"));
  });

  // ทดสอบการแสดง error หากอีเมลไม่ถูกต้อง
  it("displays error message if email is invalid", async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByText(/สมัครสมาชิก/i);
    fireEvent.click(submitButton);

    // ตรวจสอบว่าแสดงข้อความ error ของอีเมลไม่ถูกต้อง
    const emailError = await screen.findByText(/รูปแบบอีเมลไม่ถูกต้อง/i);
    expect(emailError).toBeInTheDocument();
  });
});












