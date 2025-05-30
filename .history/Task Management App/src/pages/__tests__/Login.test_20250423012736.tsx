import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../../auth/Login';
import Register from '../../auth/Register';  // ตรวจสอบให้แน่ใจว่า path ถูกต้อง

// Mock navigate function
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()), // Mock useNavigate
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
    render(<Register />); // Register component is used here for validation testing

    fireEvent.click(screen.getByRole('button', { name: /register/i })); // Adjust for the register button

    await waitFor(() => {
      expect(screen.getByText(/กรุณากรอกอีเมล/i)).toBeInTheDocument();
      expect(screen.getByText(/กรุณากรอกรหัสผ่าน/i)).toBeInTheDocument();
    });
  });

  it('should call the handleLogin function and navigate to /tasks on successful login', async () => {
    const mockNavigate = vi.fn();
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
      expect(screen.getByText(/อีเมลหรือรหัสผ่านไม่ถูกต้อง/i)).toBeInTheDocument();
    });
  });
});



