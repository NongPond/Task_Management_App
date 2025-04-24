import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../auth/Login";

// Mock global alert
global.alert = vi.fn();

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("Login component", () => {
  const setup = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    setup();
    expect(screen.getByText(/เข้าสู่ระบบ/i)).toBeInTheDocument();
  });

  it("shows validation error when fields are empty", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
      expect(screen.getByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
    });
  });

  it("shows invalid email error", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.blur(screen.getByLabelText(/email/i));

    await waitFor(() => {
      expect(screen.getByText("รูปแบบอีเมลไม่ถูกต้อง")).toBeInTheDocument();
    });
  });

  it("shows backend login error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    });
  });

  it("redirects on successful login", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "test-token",
        email: "test@example.com",
      }),
    } as Response);

    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("test-token");
      expect(localStorage.getItem("email")).toBe("test@example.com");
      expect(mockedNavigate).toHaveBeenCalledWith("/tasks");
    });
  });

  it("shows error on network failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network Error"));

    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    });
  });
});
