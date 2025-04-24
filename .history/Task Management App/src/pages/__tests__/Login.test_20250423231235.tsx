// src/components/__tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../auth/Login";
import { vi } from "vitest";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("แสดง input อีเมล และ รหัสผ่าน", () => {
    render(<Login />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("แสดง error ถ้าไม่ได้กรอกข้อมูล", async () => {
    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(await screen.findByText(/กรุณากรอกอีเมล/)).toBeInTheDocument();
    expect(await screen.findByText(/กรุณากรอกรหัสผ่าน/)).toBeInTheDocument();
  });

  it("เข้าสู่ระบบสำเร็จ และ redirect", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "mock-token", email: "test@example.com" }),
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
      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });

    expect(localStorage.getItem("token")).toBe("mock-token");
    expect(localStorage.getItem("email")).toBe("test@example.com");
  });

  it("แสดง error ถ้าอีเมลหรือรหัสผ่านผิด", async () => {
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
  });

  it("แสดง error ถ้า fetch มีปัญหา", async () => {
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



