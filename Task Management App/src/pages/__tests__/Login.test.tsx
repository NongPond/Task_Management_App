import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../auth/Login";

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
    vi.clearAllMocks();
    localStorage.clear();

    // ✅ Mock matchMedia to prevent AntD error
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const setup = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it("renders form elements correctly", () => {
    setup();
    expect(screen.getByRole("heading", { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));
    expect(await screen.findByText("กรุณากรอกอีเมล")).toBeInTheDocument();
    expect(await screen.findByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
  });

  it("shows error for invalid email format", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));
    expect(await screen.findByText("รูปแบบอีเมลไม่ถูกต้อง")).toBeInTheDocument();
  });

  it("shows error if login fails (wrong credentials)", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      })
    ));

    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(await screen.findByText("❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง")).toBeInTheDocument();
  });

  it("navigates to /tasks on successful login", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "abc123", email: "test@example.com" }),
      })
    ));

    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
      expect(localStorage.getItem("token")).toBe("abc123");
      expect(localStorage.getItem("email")).toBe("test@example.com");
    });
  });

  // New Test: Check for network failure
  it("shows error if login fails due to network issues", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("Network error"))));

    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(await screen.findByText("⚠️ เกิดข้อผิดพลาดในการเข้าสู่ระบบ")).toBeInTheDocument();
  });

  // New Test: Check for password too short
  it("shows error if password is too short", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    expect(await screen.findByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")).toBeInTheDocument();
  });

});







