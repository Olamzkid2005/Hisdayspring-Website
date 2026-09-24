import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { GallerySection } from "@/components/sections/GallerySection";
import { galleryPhotos } from "@/data/gallery";

describe("GallerySection", () => {
  beforeEach(() => {
    jest.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("filters photos by category", async () => {
    render(<GallerySection />);

    const youthButton = screen.getByRole("button", { name: "Youth Events" });
    fireEvent.click(youthButton);

    const youthButtons = screen.getAllByRole("button", { name: /^View IMG 20251017/ });
    expect(youthButtons.length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "View DSC 5072" })).not.toBeInTheDocument();
  });

  it("opens the lightbox and navigates to the next filtered photo", async () => {
    render(<GallerySection />);

    const firstPhotoButton = screen.getAllByRole("button", { name: /^View / })[0];
    const firstCaption = firstPhotoButton.getAttribute("aria-label")!.replace("View ", "");
    // The fallback label would make the caption check below meaningless.
    expect(firstCaption).not.toBe("gallery photo");
    fireEvent.click(firstPhotoButton);

    const dialog = screen.getByRole("dialog", { name: "Image lightbox" });
    // The photo is decorative (its caption is exposed as text instead), so the
    // caption is what says which picture the lightbox opened.
    expect(within(dialog).getByText(firstCaption)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next photo" }));
    await waitFor(() =>
      expect(within(dialog).queryByText(firstCaption)).not.toBeInTheDocument()
    );
    expect(screen.getByRole("dialog", { name: "Image lightbox" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close lightbox" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Image lightbox" })).not.toBeInTheDocument();
    });
  });
});
