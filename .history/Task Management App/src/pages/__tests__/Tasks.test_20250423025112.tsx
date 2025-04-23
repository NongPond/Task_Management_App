import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tasks from '../../tasks/tasks';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { describe, it, expect, vi } from "vitest";

const mockTasks = [
  { _id: '1', title: 'Test Task', description: 'Task description', status: 'pending' },
];

const email = 'test@example.com';

const server = setupServer(
  rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => {
    return res(ctx.json(mockTasks));
  }),
  rest.post('http://localhost:5000/api/tasks', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.json({ ...body, _id: '2' }));
  }),
  rest.put('http://localhost:5000/api/tasks/:id', async (req, res, ctx) => {
    const updates = await req.json();
    return res(ctx.json({ _id: req.params.id, ...updates }));
  }),
  rest.delete('http://localhost:5000/api/tasks/:id', (_, res, ctx) => {
    return res(ctx.status(204));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

describe('Tasks Component', () => {
  beforeEach(() => {
    localStorage.setItem('email', email);
  });

  it('renders tasks from API', async () => {
    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    );

    expect(await screen.findByText('Test Task')).toBeInTheDocument();
  });

  it('creates a new task', async () => {
    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText('Title');
    const descInput = screen.getByPlaceholderText('Description');
    const createButton = screen.getByRole('button', { name: /create/i });

    await userEvent.type(titleInput, 'New Task');
    await userEvent.type(descInput, 'New Description');
    fireEvent.click(createButton);

    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('edits a task', async () => {
    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    );

    const editButton = await screen.findByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue('Test Task');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Task');

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText('Updated Task')).toBeInTheDocument();
  });

  it('deletes a task', async () => {
    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument()
    );
  });

  it('logs out and redirects', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    );

    const logoutBtn = await screen.findByRole('button', { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
