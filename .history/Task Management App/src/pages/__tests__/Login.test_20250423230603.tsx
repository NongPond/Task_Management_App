// src/components/__tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../Login";
import { vi } from "vitest";

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders email and password inputs", () => {
    render(<Login />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation messages on empty submit", async () => {
    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(await screen.findByText(/กรุณากรอกอีเมล/)).toBeInTheDocument();
    expect(await screen.findByText(/กรุณากรอกรหัสผ่าน/)).toBeInTheDocument();
  });

  it("logs in successfully and navigates", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "mock-token",
        email: "test@example.com",
      }),
    } as Response);

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/tasks");
    });

    expect(localStorage.getItem("token")).toBe("mock-token");
    expect(localStorage.getItem("email")).toBe("test@example.com");
  });

  it("shows error on failed login", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    } as Response);

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "wrong@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(await screen.findByText(/อีเมลหรือรหัสผ่านไม่ถูกต้อง/)).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("shows general error if fetch fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(await screen.findByText(/เกิดข้อผิดพลาดในการเข้าสู่ระบบ/)).toBeInTheDocument();
  });
});

