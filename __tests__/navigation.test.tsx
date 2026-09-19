import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "@/components/layout/Navigation";

describe("Navigation", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("opens and closes the mobile menu", () => {
    render(<Navigation />);

    const openButton = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(openButton);
    expect(screen.getAllByRole("button", { name: "Close menu" })).toHaveLength(2);
    expect(screen.getAllByText("Give Online")).toHaveLength(2);

    fireEvent.click(screen.getAllByRole("button", { name: "Close menu" })[0]);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("scrolls to an in-page section when a section link is selected", () => {
    const section = document.createElement("section");
    section.id = "about";
    document.body.appendChild(section);
    render(<Navigation />);

    const aboutButtons = screen.getAllByRole("button", { name: "About" });
    fireEvent.click(aboutButtons[0]);

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    section.remove();
  });
});
