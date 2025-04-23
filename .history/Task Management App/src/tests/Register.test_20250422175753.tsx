import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "/auth/Register";
import { vi } from "vitest";

// Mock navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Register Component", () => {
  // Arrange
  const setup = () =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

  it("renders form inputs and submit button", () => {
    setup();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();     // Assert
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();  // Assert
    expect(screen.getByRole("button")).toHaveTextContent(/สมัครสมาชิก/);
  });

  it("shows validation messages on empty submit", async () => {
    setup();
    const button = screen.getByRole("button");

    // Act
    fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
      expect(screen.getByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
    });
  });

  it("submits form with valid inputs", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as any;

    setup();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "123456" },
    });

    // Act
    fireEvent.click(screen.getByRole("button"));

    // Assert
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/auth/register",
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });
});
