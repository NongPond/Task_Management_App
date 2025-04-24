import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../../auth/Register";
import { vi } from "vitest"; // ✅ ใช้ vi แทน jest

beforeAll(() => {
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("Register component", () => {
  it("submits form with valid inputs", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const emailInput = await screen.findByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("สมัครสมาชิกสำเร็จ! กรุณา Login")
    );
  });

  it("displays error message if email is invalid", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const emailInput = await screen.findByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(submitButton);

    const emailError = await screen.findByText(/รูปแบบอีเมลไม่ถูกต้อง/i);
    expect(emailError).toBeInTheDocument();
  });
});









