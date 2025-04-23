import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../../auth/Register";
import { vi } from "vitest";

beforeAll(() => {
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("Register component", () => {
  it("displays error message if email is invalid", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /สมัครสมาชิก/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.click(submitButton);

    const emailError = await screen.findByText((_, element) =>element?.textContent?.includes("รูปแบบอีเมลไม่ถูกต้อง")
    );
    expect(emailError).toBeInTheDocument();
  });
});















