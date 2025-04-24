// ต้องอยู่ก่อน import อื่น ๆ
import { vi } from 'vitest';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tasks from '../../tasks/tasks';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const mockTasks = [
  { _id: '1', title: 'Test Task', description: 'Task description', status: 'pending' },
];

const email = 'test@example.com';

const server = setupServer(
  rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => res(ctx.json(mockTasks))),
  rest.post('http://localhost:5000/api/tasks', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.json({ ...body, _id: '2' }));
  }),
  rest.put('http://localhost:5000/api/tasks/:id', async (req, res, ctx) => {
    const updates = await req.json();
    return res(ctx.json({ _id: req.params.id, ...updates }));
  }),
  rest.delete('http://localhost:5000/api/tasks/:id', (_, res, ctx) => res(ctx.status(204)))
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  mockNavigate.mockReset();
});
afterAll(() => server.close());

describe('Tasks Component', () => {
  beforeEach(() => {
    localStorage.setItem('email', email);
  });

  it('renders and loads tasks from API', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText('Test Task')).toBeInTheDocument();
  });

  it('shows loading state before loading tasks', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
  });

  it('shows message when no tasks found', async () => {
    server.use(rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => res(ctx.json([]))));
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText(/no tasks/i)).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    server.use(rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => res(ctx.status(500))));
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/failed to load tasks/i);
  });

  it('creates a task', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.change(await screen.findByPlaceholderText(/title/i), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'New Desc' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByText(/new task/i)).toBeInTheDocument();
  });

  it('prevents creating task with empty fields', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/both title and description are required/i);
  });

  it('edits a task', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /edit/i }));
    const input = screen.getByDisplayValue('Test Task');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Task');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText('Updated Task')).toBeInTheDocument();
  });

  it('cancels edit', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('does not update task without title or description', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /edit/i }));
    await userEvent.clear(screen.getByDisplayValue(/test task/i));
    await userEvent.clear(screen.getByDisplayValue(/task description/i));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/at least a title or description/i);
  });

  it('deletes a task', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
    await waitFor(() => expect(screen.queryByText('Test Task')).not.toBeInTheDocument());
  });

  it('handles delete failure if task not found', async () => {
    server.use(rest.delete('http://localhost:5000/api/tasks/:id', (_, res, ctx) => res(ctx.status(404))));
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/failed to delete task/i);
  });

  it('updates task status to "in-progress"', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /start/i }));
    const status = await screen.findByText((content) => /in[-\s]?progress/i.test(content));
    expect(status).toBeInTheDocument();
  });

  it('updates task status to "completed"', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /complete/i }));
    const status = await screen.findByText((text) => text.toLowerCase().includes('completed'));
    expect(status).toBeInTheDocument();
  });

  it('logs out and navigates to login', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /logout/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // Additional test case for when task creation fails
  it('shows error when create task fails', async () => {
    server.use(rest.post('http://localhost:5000/api/tasks', (_, res, ctx) => res(ctx.status(500))));
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    
    // Simulate user input
    fireEvent.change(await screen.findByPlaceholderText(/title/i), { target: { value: 'Fail Task' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Fail Desc' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
  
    // ค้นหาข้อความ error โดยใช้ matcher ที่ยืดหยุ่นมากขึ้น
    const errorMessage = await screen.findByText((content) => /failed to create task/i.test(content));
    expect(errorMessage).toBeInTheDocument();
  });
  
  

  // Test case for no email in localStorage (redirect to login)
  it('redirects to login if no email found in localStorage', () => {
    localStorage.removeItem('email');
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});







