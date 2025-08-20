import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavigationIndicator, {
  useNavigationActions,
  NavigationAction,
} from "../navigation-indicator";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: React.ComponentProps<"button">) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("NavigationIndicator", () => {
  const mockActions: NavigationAction[] = [
    {
      id: "nav-1",
      type: "navigate",
      target: "projects",
      status: "in-progress",
      timestamp: new Date(),
    },
    {
      id: "download-1",
      type: "download",
      target: "resume.pdf",
      status: "pending",
      timestamp: new Date(),
    },
    {
      id: "theme-1",
      type: "theme",
      target: "dark",
      status: "completed",
      timestamp: new Date(),
    },
  ];

  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders active navigation actions", () => {
    render(
      <NavigationIndicator actions={mockActions} onDismiss={mockOnDismiss} />
    );

    expect(screen.getByText("Navigating to projects...")).toBeInTheDocument();
    expect(screen.getByText("Download resume.pdf")).toBeInTheDocument();
    // Completed actions should not be shown as they're filtered out
    expect(screen.queryByText("Switch to dark theme")).not.toBeInTheDocument();
  });

  it("shows correct status colors and icons", () => {
    render(
      <NavigationIndicator actions={mockActions} onDismiss={mockOnDismiss} />
    );

    // Check for in-progress action styling
    const inProgressAction = screen.getByText("Navigating to projects...");
    expect(inProgressAction).toHaveClass("text-blue-600");

    // Check for pending action styling
    const pendingAction = screen.getByText("Download resume.pdf");
    expect(pendingAction).toHaveClass("text-yellow-600");
  });

  it("displays progress bar for in-progress actions", () => {
    const inProgressActions: NavigationAction[] = [
      {
        id: "nav-1",
        type: "navigate",
        target: "projects",
        status: "in-progress",
        timestamp: new Date(),
      },
    ];

    render(
      <NavigationIndicator
        actions={inProgressActions}
        onDismiss={mockOnDismiss}
      />
    );

    // Progress bar should be present for in-progress actions
    const progressBar = screen
      .getByText("Navigating to projects...")
      .closest("div")
      ?.querySelector(".bg-blue-500");
    expect(progressBar).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    const completedActions: NavigationAction[] = [
      {
        id: "nav-1",
        type: "navigate",
        target: "projects",
        status: "completed",
        timestamp: new Date(),
      },
    ];

    render(
      <NavigationIndicator
        actions={completedActions}
        onDismiss={mockOnDismiss}
      />
    );

    const dismissButton = screen.getByLabelText("Dismiss notification");
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalledWith("nav-1");
  });

  it("does not show dismiss button for in-progress actions", () => {
    const inProgressActions: NavigationAction[] = [
      {
        id: "nav-1",
        type: "navigate",
        target: "projects",
        status: "in-progress",
        timestamp: new Date(),
      },
    ];

    render(
      <NavigationIndicator
        actions={inProgressActions}
        onDismiss={mockOnDismiss}
      />
    );

    expect(
      screen.queryByLabelText("Dismiss notification")
    ).not.toBeInTheDocument();
  });

  it("renders nothing when no active actions", () => {
    const { container } = render(
      <NavigationIndicator actions={[]} onDismiss={mockOnDismiss} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("handles different action types correctly", () => {
    const differentActions: NavigationAction[] = [
      {
        id: "modal-1",
        type: "modal",
        target: "contact",
        status: "pending",
        timestamp: new Date(),
      },
      {
        id: "scroll-1",
        type: "scroll",
        target: "about",
        status: "pending",
        timestamp: new Date(),
      },
    ];

    render(
      <NavigationIndicator
        actions={differentActions}
        onDismiss={mockOnDismiss}
      />
    );

    expect(screen.getByText("Open contact")).toBeInTheDocument();
    expect(screen.getByText("Scroll to about")).toBeInTheDocument();
  });
});

describe("useNavigationActions hook", () => {
  const TestComponent = () => {
    const {
      actions,
      addAction,
      updateActionStatus,
      removeAction,
      clearCompletedActions,
    } = useNavigationActions();

    return (
      <div>
        <div data-testid="actions-count">{actions.length}</div>
        <button onClick={() => addAction("navigate", "projects")}>
          Add Action
        </button>
        <button onClick={() => updateActionStatus(actions[0]?.id, "completed")}>
          Complete First Action
        </button>
        <button onClick={() => removeAction(actions[0]?.id)}>
          Remove First Action
        </button>
        <button onClick={clearCompletedActions}>Clear Completed</button>
        {actions.map((action) => (
          <div key={action.id} data-testid={`action-${action.id}`}>
            {action.type}-{action.target}-{action.status}
          </div>
        ))}
      </div>
    );
  };

  it("adds actions correctly", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("actions-count")).toHaveTextContent("0");

    fireEvent.click(screen.getByText("Add Action"));

    expect(screen.getByTestId("actions-count")).toHaveTextContent("1");
    expect(screen.getByText(/navigate-projects-pending/)).toBeInTheDocument();
  });

  it("updates action status correctly", async () => {
    render(<TestComponent />);

    // Add an action first
    fireEvent.click(screen.getByText("Add Action"));
    expect(screen.getByText(/navigate-projects-pending/)).toBeInTheDocument();

    // Update its status
    fireEvent.click(screen.getByText("Complete First Action"));
    expect(screen.getByText(/navigate-projects-completed/)).toBeInTheDocument();
  });

  it("removes actions correctly", () => {
    render(<TestComponent />);

    // Add an action first
    fireEvent.click(screen.getByText("Add Action"));
    expect(screen.getByTestId("actions-count")).toHaveTextContent("1");

    // Remove it
    fireEvent.click(screen.getByText("Remove First Action"));
    expect(screen.getByTestId("actions-count")).toHaveTextContent("0");
  });

  it("clears completed actions correctly", () => {
    render(<TestComponent />);

    // Add and complete an action
    fireEvent.click(screen.getByText("Add Action"));
    fireEvent.click(screen.getByText("Complete First Action"));

    // Add another pending action
    fireEvent.click(screen.getByText("Add Action"));

    expect(screen.getByTestId("actions-count")).toHaveTextContent("2");

    // Clear completed actions
    fireEvent.click(screen.getByText("Clear Completed"));

    expect(screen.getByTestId("actions-count")).toHaveTextContent("1");
    expect(screen.getByText(/navigate-projects-pending/)).toBeInTheDocument();
  });
});
