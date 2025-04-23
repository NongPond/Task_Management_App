import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../Register";

describe("Register component", () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

  it("renders register form correctly", () => {
    setup();
    expect(screen.getByText("สมัครสมาชิก")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.blur(screen.getByLabelText("Email"));
    await waitFor(() => {
      expect(screen.getByText("รูปแบบอีเมลไม่ถูกต้อง")).toBeInTheDocument();
    });
  });

  it("shows error for short password", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });
    fireEvent.blur(screen.getByLabelText("Password"));
    await waitFor(() => {
      expect(
        screen.getByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      ).toBeInTheDocument();
    });
  });

  it("disables button while submitting", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    const button = screen.getByRole("button", { name: /สมัครสมาชิก/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
});

















