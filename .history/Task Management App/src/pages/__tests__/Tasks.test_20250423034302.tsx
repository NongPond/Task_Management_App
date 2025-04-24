// ต้องอยู่ก่อน import อื่น ๆ
import { vi } from 'vitest';

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

  it('shows loading initially', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    // Ensure loading state is visible initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for tasks to be rendered
    await waitFor(() => expect(screen.getByText('Test Task')).toBeInTheDocument());
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
    
    // Ensure error message appears
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to load tasks. Please try again later.');
  });

  it('creates a new task', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText('Title'), 'New Task');
    await userEvent.type(screen.getByPlaceholderText('Description'), 'New Description');
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('prevents creating task with empty fields', async () => {
    render(<MemoryRouter><Tasks /></MemoryRouter>);
  
    const titleInput = screen.getByPlaceholderText('Title');
    const descInput = screen.getByPlaceholderText('Description');
    const createButton = screen.getByRole('button', { name: /create/i });
  
    // Clear inputs
    await userEvent.clear(titleInput);
    await userEvent.clear(descInput);
  
    // Click create button
    fireEvent.click(createButton);
  
    // Use a flexible matcher for error messages
    const errorMessage = await screen.findByText((content, element) => {
      if (element === null) return false;
      return /required/i.test(content) && element.tagName.toLowerCase() === 'span';  // Adjust tagName if needed
    });
  
    // Check that the error message is in the document
    expect(errorMessage).toBeInTheDocument();
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
});



