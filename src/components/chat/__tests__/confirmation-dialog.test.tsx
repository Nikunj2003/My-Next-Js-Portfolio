import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationDialog, {
  useConfirmationDialog,
} from "../confirmation-dialog";

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

describe("ConfirmationDialog", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body overflow style
    document.body.style.overflow = "unset";
  });

  it("renders when open", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <ConfirmationDialog
        isOpen={false}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText("Confirm"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when close button is clicked", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByLabelText("Close dialog"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when backdrop is clicked", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Click on the backdrop (first div with backdrop styling)
    const backdrop = document.querySelector(".bg-black\\/50");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    }
  });

  it("handles escape key press", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("does not handle escape key when closed", () => {
    render(
      <ConfirmationDialog
        isOpen={false}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it("renders custom button text", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
    expect(screen.getByText("No, Keep")).toBeInTheDocument();
  });

  it("applies destructive variant styling", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        variant="destructive"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("bg-red-600");
  });

  it("applies default variant styling", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        variant="default"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("bg-blue-600");
  });

  it("prevents body scroll when open", () => {
    const { rerender } = render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <ConfirmationDialog
        isOpen={false}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(document.body.style.overflow).toBe("unset");
  });
});

describe("useConfirmationDialog hook", () => {
  const TestComponent = () => {
    const { showConfirmation, hideConfirmation, ConfirmationDialog } =
      useConfirmationDialog();

    return (
      <div>
        <button
          onClick={() =>
            showConfirmation({
              title: "Test Confirmation",
              message: "Are you sure?",
              onConfirm: () => console.log("Confirmed"),
              onCancel: () => console.log("Cancelled"),
            })
          }
        >
          Show Confirmation
        </button>
        <button onClick={hideConfirmation}>Hide Confirmation</button>
        <ConfirmationDialog />
      </div>
    );
  };

  it("shows confirmation dialog when showConfirmation is called", () => {
    render(<TestComponent />);

    expect(screen.queryByText("Test Confirmation")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Show Confirmation"));

    expect(screen.getByText("Test Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("hides confirmation dialog when hideConfirmation is called", () => {
    render(<TestComponent />);

    // Show the dialog first
    fireEvent.click(screen.getByText("Show Confirmation"));
    expect(screen.getByText("Test Confirmation")).toBeInTheDocument();

    // Hide it
    fireEvent.click(screen.getByText("Hide Confirmation"));
    expect(screen.queryByText("Test Confirmation")).not.toBeInTheDocument();
  });

  it("hides dialog when confirm is clicked", () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByText("Show Confirmation"));
    expect(screen.getByText("Test Confirmation")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm"));
    expect(screen.queryByText("Test Confirmation")).not.toBeInTheDocument();
  });

  it("hides dialog when cancel is clicked", () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByText("Show Confirmation"));
    expect(screen.getByText("Test Confirmation")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Test Confirmation")).not.toBeInTheDocument();
  });

  it("handles destructive variant", () => {
    const TestComponentDestructive = () => {
      const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

      return (
        <div>
          <button
            onClick={() =>
              showConfirmation({
                title: "Delete Item",
                message: "This action cannot be undone.",
                variant: "destructive",
                confirmText: "Delete",
                onConfirm: () => console.log("Deleted"),
              })
            }
          >
            Show Destructive
          </button>
          <ConfirmationDialog />
        </div>
      );
    };

    render(<TestComponentDestructive />);

    fireEvent.click(screen.getByText("Show Destructive"));

    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toHaveClass("bg-red-600");
  });
});
