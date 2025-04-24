// __tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../ogin";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

const renderWithRouter = (component: JSX.Element) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors", async () => {
    renderWithRouter(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/กรุณากรอกอีเมล/)).toBeInTheDocument();
    expect(await screen.findByText(/กรุณากรอกรหัสผ่าน/)).toBeInTheDocument();
  });

  it("shows invalid email error", async () => {
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findByText(/รูปแบบอีเมลไม่ถูกต้อง/)).toBeInTheDocument();
  });

  it("logs in successfully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "mock-token",
        email: "test@example.com",
      }),
    });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-token");
      expect(localStorage.getItem("email")).toBe("test@example.com");
      expect(mockedNavigate).toHaveBeenCalledWith("/tasks");
    });
  });

  it("shows alert on login failure", async () => {
    window.alert = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    });
  });

  it("has a link to register", () => {
    renderWithRouter(<Login />);
    const link = screen.getByRole("link", { name: /สมัครสมาชิก/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });
});

