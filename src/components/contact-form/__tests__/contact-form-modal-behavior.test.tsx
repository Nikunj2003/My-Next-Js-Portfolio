import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import ContactButton from "../contact-button";
import ContactFormModal from "../contact-form-modal";

jest.mock("next/router", () => ({
  useRouter: () => ({ asPath: "/" }),
}));

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}));

jest.mock("../floating-mail-button", () => ({
  __esModule: true,
  default: ({ openModal }: { openModal: (open: boolean) => void }) => (
    <button onClick={() => openModal(true)}>floating-open</button>
  ),
  floatingMailButtonoptions: {},
}));

jest.mock("@headlessui/react", () => {
  const Dialog = ({
    children,
    onClose,
    ...props
  }: React.ComponentProps<"div"> & { onClose?: (open: boolean) => void }) => (
    <div
      {...props}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose?.(false);
        }
      }}
    >
      {children}
    </div>
  );

  const DialogPanel = ({ children, ...props }: React.ComponentProps<"div">) => (
    <div {...props}>{children}</div>
  );

  const DialogTitle = ({
    children,
    ...props
  }: React.ComponentProps<"h2">) => <h2 {...props}>{children}</h2>;

  const Transition = ({
    show,
    children,
  }: {
    show?: boolean;
    children: React.ReactNode;
  }) => (show ? <>{children}</> : null);

  const TransitionChild = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  return {
    Dialog: Object.assign(Dialog, {
      Panel: DialogPanel,
      Title: DialogTitle,
    }),
    Transition: Object.assign(Transition, {
      Child: TransitionChild,
    }),
  };
});

describe("Contact modal behavior", () => {
  beforeEach(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      })),
    });
  });

  it("closes when close button is clicked", () => {
    const setShowModal = jest.fn();

    render(<ContactFormModal showModal={true} setShowModal={setShowModal} />);

    fireEvent.click(screen.getByLabelText("Close modal"));

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("closes on escape key", () => {
    const setShowModal = jest.fn();

    render(<ContactFormModal showModal={true} setShowModal={setShowModal} />);

    fireEvent.keyDown(screen.getByText("Send Message").closest("div")!, {
      key: "Escape",
      bubbles: true,
    });

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("opens modal when open-contact-modal event is dispatched", () => {
    render(<ContactButton />);

    expect(screen.queryByText("Send Message")).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("open-contact-modal"));
    });

    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });
});
