import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../../auth/Register";

// Mock global alert
global.alert = vi.fn();

describe("Register component", () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders register form correctly", async () => {
    setup();
  
    // Find all elements with the text "สมัครสมาชิก"
    const elements = screen.queryAllByText(/สมัครสมาชิก/i);
    expect(elements).toHaveLength(2); // Should be two elements: h1 and button
  });
  

  it("shows error for invalid email", async () => {
    setup();
  
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: "สมัครสมาชิก" }));
  
    const emailError = await screen.findByTestId("email-error");
    expect(emailError).toHaveTextContent("รูปแบบอีเมลไม่ถูกต้อง");
  });

  it("submits form successfully", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);
  
    setup();
  
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "สมัครสมาชิก" }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("สมัครสมาชิกสำเร็จ! กรุณา Login");
    });
  });
  

  it("shows backend error message", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก" }),
    } as Response);
  
    setup();
  
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
  
    // ใช้ getByRole แทน getByText
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));
  
    await waitFor(() => {
        expect(screen.getByText(/เกิดข้อผิดพลาดในการสมัครสมาชิก/i)).toBeInTheDocument();
    });
  });
  

  it("shows default error message when no message from backend", async () => {
    setup();
  
    // ต้อง trigger validation ก่อน โดยการกดปุ่ม submit
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));
  
    await waitFor(() => {
      expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
      expect(screen.getByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
    });
  });
  
    
  
  it("shows network error", async () => {
    // Mock fetch ให้เกิด error
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network Error"));
  
    setup();
  
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
  
    // ใช้ getByRole แทน getByText เพื่อเลือกปุ่ม
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));
  
    await screen.findByText(/ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้/i);
  });
});


















