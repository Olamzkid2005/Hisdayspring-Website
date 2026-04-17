import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/Input";

describe("Input Component", () => {
  it("renders with label", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("displays error message when error prop is provided", () => {
    render(
      <Input
        label="Email"
        name="email"
        error="Invalid email format"
      />
    );
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });

  it("handles input changes", () => {
    const handleChange = jest.fn();
    render(
      <Input
        label="Name"
        name="name"
        onChange={handleChange}
      />
    );
    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: "John" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies error styling when error prop is provided", () => {
    render(<Input label="Email" name="email" error="Error" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass("border-red-500");
  });
});
