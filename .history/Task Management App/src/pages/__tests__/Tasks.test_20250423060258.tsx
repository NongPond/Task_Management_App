// Must be before other imports
import { vi } from 'vitest';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
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
    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to load tasks/i);
  });

  it('renders multiple tasks when API returns many', async () => {
    const twoTasks = [
      ...mockTasks,
      { _id: '2', title: 'Second Task', description: 'Desc 2', status: 'completed' },
    ];
    server.use(rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => res(ctx.json(twoTasks))));
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText('Test Task')).toBeInTheDocument();
    expect(await screen.findByText('Second Task')).toBeInTheDocument();
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
    expect(await screen.findByRole('alert')).toHaveTextContent(/both title and description are required/i);
  });

  it('clears formError after successful create', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/both title and description are required/i);

    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'Ok' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Ok' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('shows save & cancel buttons in edit mode', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /edit/i }));
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
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

  it('updates localStorage when a task is updated', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText('Test Task')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    const input = screen.getByDisplayValue('Test Task');
    await userEvent.clear(input);
    await userEvent.type(input, 'Modified Task');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText('Modified Task')).toBeInTheDocument();

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(`tasks-${email}`) || '[]');
      expect(stored[0]).toMatchObject({ title: 'Modified Task' });
    });
  });

  it('deletes a task', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
    await waitFor(() => expect(screen.queryByText('Test Task')).not.toBeInTheDocument());
  });

  it('updates localStorage when a task is deleted', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText('Test Task')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(screen.queryByText('Test Task')).not.toBeInTheDocument());

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(`tasks-${email}`) || '[]');
      expect(stored).toHaveLength(0);
    });
  });

  it('handles delete failure if task not found', async () => {
    server.use(rest.delete('http://localhost:5000/api/tasks/:id', (_, res, ctx) => res(ctx.status(404))));
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to delete task/i);
  });

  it('updates task status to "in-progress"', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /start/i }));
    expect(await screen.findByText((c) => /in[-\s]?progress/i.test(c))).toBeInTheDocument();
  });

  it('updates task status to "completed"', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /complete/i }));
    expect(await screen.findByText((c) => c.toLowerCase().includes('completed'))).toBeInTheDocument();
  });

  it('logs out and navigates to login', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /logout/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error when create task fails', async () => {
    server.use(rest.post('http://localhost:5000/api/tasks', (_, res, ctx) => res(ctx.status(500))));
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.change(await screen.findByPlaceholderText(/title/i), { target: { value: 'Fail Task' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Fail Desc' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to create task/i);
  });

  it('persists tasks to localStorage after initial load', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText('Test Task')).toBeInTheDocument();
    expect(localStorage.getItem(`tasks-${email}`)).toEqual(JSON.stringify(mockTasks));
  });

  it('redirects to login if no email found in localStorage', async () => {
    localStorage.removeItem('email');
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });
});











