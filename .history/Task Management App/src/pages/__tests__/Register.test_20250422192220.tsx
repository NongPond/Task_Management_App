import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../Register";

test("displays error message if email is invalid", async () => {
  render(<Register />);

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });

  fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  fireEvent.blur(emailInput); // ⬅️ สำคัญ!
  fireEvent.change(passwordInput, { target: { value: "12345678" } });
  fireEvent.click(submitButton);

  const emailError = await screen.findByText((_, element) =>
    element?.textContent?.includes("รูปแบบอีเมลไม่ถูกต้อง")
  );

  expect(emailError).toBeInTheDocument();
});
















