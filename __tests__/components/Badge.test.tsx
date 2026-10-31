import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui";

describe("Badge Component", () => {
  it("renders the default small tone", () => {
    render(<Badge>General</Badge>);
    expect(screen.getByText("General")).toHaveClass(
      "px-2",
      "py-0.5",
      "text-xs",
      "bg-primary-container/10"
    );
  });

  // Call sites pass their own padding and text size; those must replace the
  // size defaults explicitly rather than winning by Tailwind's class order.
  it("lets className replace the size utilities", () => {
    render(<Badge className="px-6 py-2.5 text-sm">Featured</Badge>);
    const badge = screen.getByText("Featured");

    expect(badge).toHaveClass("px-6", "py-2.5", "text-sm");
    expect(badge).not.toHaveClass("px-2");
    expect(badge).not.toHaveClass("py-0.5");
    expect(badge).not.toHaveClass("text-xs");
  });

  it("does not confuse text colour with text size", () => {
    render(<Badge className="text-primary">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("text-xs", "text-primary");
  });

  it("replaces the tracking that uppercase adds", () => {
    render(
      <Badge uppercase className="tracking-widest">
        Welcome
      </Badge>
    );
    const badge = screen.getByText("Welcome");

    expect(badge).toHaveClass("tracking-widest");
    expect(badge).not.toHaveClass("tracking-wider");
  });
});
