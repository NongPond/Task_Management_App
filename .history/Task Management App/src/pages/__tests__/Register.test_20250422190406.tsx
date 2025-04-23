import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../Register";
import { BrowserRouter } from "react-router-dom";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

test("Register component > submits form with valid inputs", () => {
  renderWithRouter(<Register />);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  const submitButton = screen.getByRole('button', { name: /สมัครสมาชิก/i });
  fireEvent.click(submitButton);

  // Your assertion here (e.g., expect to navigate, show success, etc.)
});

test("Register component > displays error message if email is invalid", async () => {
  renderWithRouter(<Register />);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);

  fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  fireEvent.change(passwordInput, { target: { value: "12345678" } });

  const submitButton = screen.getByRole('button', { name: /สมัครสมาชิก/i });
  fireEvent.click(submitButton);

  const error = await screen.findByText(/รูปแบบอีเมลไม่ถูกต้อง/i);
  expect(error).toBeInTheDocument();
});













