import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../../auth/Login';

// Mock navigate function
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Login component', () => {
  it('should render the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should display validation errors for invalid input', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // Using findByText for asynchronous elements
      const emailError = screen.findByText(/กรุณากรอกอีเมล/i);
      const passwordError = screen.findByText(/กรุณากรอกรหัสผ่าน/i);
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });

  it('should call the handleLogin function and navigate to /tasks on successful login', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate); // Ensure the mockNavigate is used in the component

    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'mock-token', email: 'test@example.com' }),
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('email', 'test@example.com');
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  it('should show an alert when the login request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      const alertText = screen.queryByText(/อีเมลหรือรหัสผ่านไม่ถูกต้อง/i);
      expect(alertText).toBeInTheDocument(); // Check if the element is found
    });
  });
});

