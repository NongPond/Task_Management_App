import { BrowserRouter as Router } from 'react-router-dom';

describe('Register component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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

    // Wait for alert call
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("สมัครสมาชิกสำเร็จ! กรุณา Login"));
  });

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

    // Ensure the error message is displayed
    const emailError = await screen.findByText(/รูปแบบอีเมลไม่ถูกต้อง/i);
    expect(emailError).toBeInTheDocument();
  });
});











