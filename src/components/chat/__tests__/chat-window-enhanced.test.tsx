import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWindow from '../chat-window';
import { ToolCall } from '@/types/tools';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
    textarea: ({ children, ...props }: React.ComponentProps<'textarea'>) => <textarea {...props}>{children}</textarea>,
    span: ({ children, ...props }: React.ComponentProps<'span'>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock hooks
jest.mock('@/hooks/useAutoSizeTextarea', () => ({
  useAutosizeTextArea: jest.fn(),
}));

// Mock utilities
jest.mock('@/utility/ai-chat-responses', () => ({
  getAIResponse: jest.fn(),
}));

// Mock react-markdown
jest.mock('react-markdown', () => {
  return function ReactMarkdown({ children }: { children: string }) {
    return <div>{children}</div>;
  };
});

jest.mock('remark-gfm', () => () => {});

// Mock fetch
global.fetch = jest.fn();

describe('ChatWindow Enhanced Features', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'Test response',
        toolCalls: [],
      }),
    });
  });

  it('renders tool execution results when present', async () => {
    const mockToolCalls: ToolCall[] = [
      {
        id: 'test-1',
        name: 'NavigateToPage',
        arguments: { page: 'projects' },
        result: {
          success: true,
          data: 'Successfully navigated to projects page',
          actions: [
            {
              type: 'navigate',
              target: 'projects',
              data: {}
            }
          ]
        }
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'I\'ve navigated to the projects page for you.',
        toolCalls: mockToolCalls,
      }),
    });

    render(<ChatWindow isOpen={true} onClose={mockOnClose} />);

    // Send a message to trigger tool execution
    const input = screen.getByPlaceholderText(/Ask about Nikunj's experience/);
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Show me projects' } });
    fireEvent.click(sendButton);

    // Wait for the response with tool results
    await waitFor(() => {
      expect(screen.getByText('Navigate To Page')).toBeInTheDocument();
      expect(screen.getByText('Successfully navigated to projects page')).toBeInTheDocument();
      expect(screen.getByText('Navigating to projects')).toBeInTheDocument();
    });
  });

  it('displays error states for failed tool executions', async () => {
    const mockToolCalls: ToolCall[] = [
      {
        id: 'test-2',
        name: 'TriggerDownload',
        arguments: { file: 'resume' },
        result: {
          success: false,
          error: {
            code: 'FILE_NOT_FOUND',
            message: 'Resume file not found',
            suggestions: ['Check if the file exists', 'Try again later']
          }
        }
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'I encountered an error while trying to download the resume.',
        toolCalls: mockToolCalls,
      }),
    });

    render(<ChatWindow isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Ask about Nikunj's experience/);
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Download resume' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Trigger Download')).toBeInTheDocument();
      expect(screen.getByText('Resume file not found')).toBeInTheDocument();
      expect(screen.getByText('Check if the file exists')).toBeInTheDocument();
      expect(screen.getByText('Try again later')).toBeInTheDocument();
    });
  });

  it('shows enhanced loading indicator during tool execution', async () => {
    // Mock a delayed response
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            response: 'Test response',
            toolCalls: [],
          }),
        }), 100)
      )
    );

    render(<ChatWindow isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Ask about Nikunj's experience/);
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Check for enhanced loading states
    expect(screen.getByText('Processing request...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Processing request...')).not.toBeInTheDocument();
    });
  });

  it('handles multiple tool calls in a single response', async () => {
    const mockToolCalls: ToolCall[] = [
      {
        id: 'test-3',
        name: 'NavigateToPage',
        arguments: { page: 'projects' },
        result: {
          success: true,
          data: 'Navigated to projects',
          actions: [{ type: 'navigate', target: 'projects', data: {} }]
        }
      },
      {
        id: 'test-4',
        name: 'ToggleTheme',
        arguments: { theme: 'dark' },
        result: {
          success: true,
          data: 'Theme switched to dark',
          actions: [{ type: 'theme', target: 'dark', data: {} }]
        }
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'I\'ve navigated to projects and switched to dark theme.',
        toolCalls: mockToolCalls,
      }),
    });

    render(<ChatWindow isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Ask about Nikunj's experience/);
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Show projects in dark mode' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Navigate To Page')).toBeInTheDocument();
      expect(screen.getByText('Toggle Theme')).toBeInTheDocument();
      expect(screen.getByText('Navigating to projects')).toBeInTheDocument();
      expect(screen.getByText('Switching to dark theme')).toBeInTheDocument();
    });
  });

  it('displays tool execution results with proper formatting', async () => {
    const mockToolCalls: ToolCall[] = [
      {
        id: 'test-5',
        name: 'GetProjects',
        arguments: { category: 'web' },
        result: {
          success: true,
          data: {
            projects: [
              { name: 'Project 1', tech: ['React', 'Node.js'] },
              { name: 'Project 2', tech: ['Vue', 'Python'] }
            ]
          }
        }
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'Here are the web projects.',
        toolCalls: mockToolCalls,
      }),
    });

    render(<ChatWindow isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Ask about Nikunj's experience/);
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Show web projects' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Get Projects')).toBeInTheDocument();
      // Check that JSON data is formatted properly
      expect(screen.getByText(/"projects":/)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ChatWindow isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Ask about Nikunj's experience/);
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/I apologize, but I'm having trouble responding/)).toBeInTheDocument();
    });
  });

  it('sends correct context information to API', async () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/projects' },
      writable: true,
    });

    // Mock document.documentElement.classList
    Object.defineProperty(document.documentElement, 'classList', {
      value: { contains: jest.fn().mockReturnValue(true) },
      writable: true,
    });

    render(<ChatWindow isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/Ask about Nikunj's experience/);
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test message',
          conversationHistory: expect.any(Array),
          currentPage: 'projects',
          currentTheme: 'dark',
          userAgent: expect.any(String),
        }),
      });
    });
  });
});