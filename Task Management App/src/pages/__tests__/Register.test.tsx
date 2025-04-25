import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../../auth/Register";
import { message } from "antd";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the global fetch API
vi.stubGlobal("fetch", vi.fn());

// Mock message.success and message.error
vi.spyOn(message, "success").mockImplementation(vi.fn());
vi.spyOn(message, "error").mockImplementation(vi.fn());

describe("Register Component", () => {
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
        <Register />
      </BrowserRouter>
    );
  };

  it("renders form elements correctly", () => {
    setup();
    expect(screen.getByRole("heading", { name: /สมัครสมาชิก/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /สมัครสมาชิก/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));
    expect(await screen.findByText("กรุณากรอกอีเมล")).toBeInTheDocument();
    expect(await screen.findByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
  });

  it("shows error for invalid email format", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));
    expect(await screen.findByText("รูปแบบอีเมลไม่ถูกต้อง")).toBeInTheDocument();
  });

  it("shows error if registration fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก" }),
      })
    ));
  
    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));
  
    // ตรวจสอบว่า message.error ถูกเรียกด้วยข้อความที่คาดหวัง
    await waitFor(() => expect(message.error).toHaveBeenCalledWith("เกิดข้อผิดพลาดในการสมัครสมาชิก"));
  });
  
  

  it("shows success message and navigates to login page on successful registration", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Registration successful!" }),
      })
    ));

    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith("สมัครสมาชิกสำเร็จ! กรุณา Login");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

});

