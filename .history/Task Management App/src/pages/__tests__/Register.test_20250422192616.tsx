import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../..//Register";

test("displays error message if email is invalid", async () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });

  fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  fireEvent.blur(emailInput); // ทำให้ trigger validation
  fireEvent.change(passwordInput, { target: { value: "12345678" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(
      screen.getByText("รูปแบบอีเมลไม่ถูกต้อง")
    ).toBeInTheDocument();
  });
});
















