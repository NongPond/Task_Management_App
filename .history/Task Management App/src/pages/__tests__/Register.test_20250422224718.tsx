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

  it("renders register form correctly", () => {
    setup();
    const elements = screen.queryAllByText(/สมัครสมาชิก/i);
    expect(elements).toHaveLength(2); // header + button
  });

  it("shows error for invalid email", async () => {
    setup();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));

    // แนะนำให้ใช้ data-testid แทนข้อความใน text node
    const error = await screen.findByTestId("email-error");
    expect(error).toHaveTextContent("รูปแบบอีเมลไม่ถูกต้อง");
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
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));

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
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    });
  });

  it("shows default validation messages when inputs are empty", async () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));

    await waitFor(() => {
      expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
      expect(screen.getByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
    });
  });

  it("shows network error", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network Error"));

    setup();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /สมัครสมาชิก/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    });
  });
});


















