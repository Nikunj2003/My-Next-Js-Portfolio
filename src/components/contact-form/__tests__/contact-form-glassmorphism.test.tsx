import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ContactForm from "../contact-form";
import ContactFormModal from "../contact-form-modal";

jest.mock("@headlessui/react", () => {
  const Dialog = ({ children, ...props }: React.ComponentProps<"div">) => (
    <div {...props}>{children}</div>
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

describe("Contact form glassmorphism styles", () => {
  it("uses frosted glass styling for the modal shell", () => {
    render(<ContactFormModal showModal={true} setShowModal={jest.fn()} />);

    expect(document.querySelector(".bg-background\\/70")).toBeInTheDocument();
    expect(document.querySelector(".backdrop-blur-md")).toBeInTheDocument();
    expect(document.querySelector(".backdrop-blur-xl")).toBeInTheDocument();
    expect(document.querySelector(".ring-zinc-200\\/50")).toBeInTheDocument();
    expect(screen.getByLabelText("Close modal")).toHaveClass("bg-white/30");
  });

  it("uses translucent glass field surfaces", () => {
    render(<ContactForm />);

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const messageTextarea = screen.getByPlaceholderText(
      "Tell me about your project or idea..."
    );

    expect(emailInput).toHaveClass("bg-white/10");
    expect(emailInput).toHaveClass("dark:bg-black/25");
    expect(emailInput).toHaveClass("backdrop-blur-sm");

    expect(messageTextarea).toHaveClass("bg-white/10");
    expect(messageTextarea).toHaveClass("dark:bg-black/25");
    expect(messageTextarea).toHaveClass("backdrop-blur-sm");
  });
});
