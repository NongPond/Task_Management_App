import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../../auth/Login";
import { useNavigate } from 'react-router-dom';

// Mock global alert
global.alert = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    npx vitest runactual,
    useNavigate: () => vi.fn(), // mock navigate
  };
});

describe("Login component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/เข้าสู่ระบบ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
      expect(screen.getByText("กรุณากรอกรหัสผ่าน")).toBeInTheDocument();
    });
  });

  it("shows error on login failure", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    });
  });

  it("logs in successfully", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "test-token",
        email: "test@example.com",
      }),
    } as Response);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

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
    });
  });
});

