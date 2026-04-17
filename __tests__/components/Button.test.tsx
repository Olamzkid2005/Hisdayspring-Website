import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled();
  });

  it("applies primary variant classes correctly", () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button", { name: /primary/i })).toHaveClass(
      "bg-accent-500"
    );
  });

  it("applies secondary variant classes correctly", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button", { name: /secondary/i })).toHaveClass(
      "bg-primary-700"
    );
  });

  it("renders with different sizes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button", { name: /small/i })).toBeInTheDocument();
  });
});
