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
  mockNavigate.mockReset();
});
afterAll(() => server.close());

describe('Tasks Component', () => {
  beforeEach(() => {
    localStorage.setItem('email', email);
  });

  it('renders tasks from API', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText('Test Task')).toBeInTheDocument();
  });

  test('shows loading initially', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);

    await waitFor(() => {
      const found = Array.from(document.querySelectorAll('*')).some(el =>
        /loading/i.test(el.textContent || '')
      );
      expect(found).toBe(true);
    });
  });

  it('displays message when no tasks are found', async () => {
    server.use(
      rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    expect(await screen.findByText(/no tasks/i)).toBeInTheDocument();
  });

  it('displays error when task fetch fails', async () => {
    server.use(
      rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => {
        return res(ctx.status(500)); // Simulate error
      })
    );

    render(<MemoryRouter><Tasks /></MemoryRouter>);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to load tasks. Please try again later.');
  });

  it('creates a new task', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
  
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    });
  
    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: 'Test Description' },
    });
  
    const createButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createButton);
  
    expect(await screen.findByText(/test task/i)).toBeInTheDocument();
  });

  test('prevents creating task with empty fields', async () => {
    render(<Tasks />);
  
    await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument());
  
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
  
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/both title and description are required/i);
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

  it('deletes a task', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
    await waitFor(() => expect(screen.queryByText('Test Task')).not.toBeInTheDocument());
  });

  it('logs out and redirects', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /logout/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not create task when title is empty', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: 'Description without title' },
    });

    const createButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/both title and description are required/i);
  });

  it('does not allow task update without title or description', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
  
    // รอ task แรกขึ้นมาก่อน
    fireEvent.click(await screen.findByRole('button', { name: /edit/i }));
  
    // เคลียร์ title และ description ทั้งสองช่อง
    const titleInput = screen.getByDisplayValue(/test task/i);
    const descInput = screen.getByDisplayValue(/task description/i);
    await userEvent.clear(titleInput);
    await userEvent.clear(descInput);
  
    // บันทึกโดยไม่มีข้อมูล
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
  
    // ควรแสดง error
    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent(/at least a title or description/i);
  });
  

  it('prevents task deletion if task not found', async () => {
    server.use(
      rest.delete('http://localhost:5000/api/tasks/:id', (_, res, ctx) => {
        return res(ctx.status(404)); // task not found
      })
    );
  
    render(<MemoryRouter><Tasks /></MemoryRouter>);
  
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
  
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/failed to delete task/i);
  });

  it('shows loading state before tasks are loaded', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  it('shows error message when there is a failure in fetching tasks', async () => {
    server.use(
      rest.get(`http://localhost:5000/api/tasks/${email}`, (_, res, ctx) => {
        return res(ctx.status(500)); // Simulate error
      })
    );

    render(<MemoryRouter><Tasks /></MemoryRouter>);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Failed to load tasks. Please try again later.');
  });

  it('changes task status to "in-progress" when clicking start button', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: /start/i }));
  
    expect(
      await screen.findByText((_content, el) => el?.textContent === 'in-progress')
    ).toBeInTheDocument();
  });
  

  it('allows changing task status to completed', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
  
    const completeButton = await screen.findByRole('button', { name: /complete/i });
    expect(completeButton).toBeInTheDocument();
    fireEvent.click(completeButton);
  
    await waitFor(() => {
      expect(screen.getByText((text) => text.toLowerCase().includes('completed'))).toBeInTheDocument();
    });
  });
});





