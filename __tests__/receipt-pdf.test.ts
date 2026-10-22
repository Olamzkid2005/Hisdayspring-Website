import { createReceiptPdf, downloadReceiptPdf } from "@/lib/receipt-pdf";

const receipt = {
  title: "BOOK ORDER RECEIPT",
  reference: "hds-order-12345",
  paidAt: "20 Oct 2026, 10:15 am WAT",
  paymentMethod: "Card payment",
  lines: [
    { label: "A Study (With Grace)", amount: 2500 },
    { label: "Donation note without amount" },
  ],
  total: 2500,
  note: "Collection: pick up in church.",
};

describe("receipt PDF download", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("creates a readable one-page PDF with receipt details and valid xref offsets", () => {
    const pdf = createReceiptPdf(receipt);
    expect(pdf.startsWith("%PDF-1.4\n")).toBe(true);
    expect(pdf).toContain("HISDAYSPRING EVANGELICAL MINISTRY INTERNATIONAL");
    expect(pdf).toContain("BOOK ORDER RECEIPT");
    expect(pdf).toContain("Reference: hds-order-12345");
    expect(pdf).toContain("Paid on: 20 Oct 2026, 10:15 am WAT");
    expect(pdf).toContain("A Study \\(With Grace\\) - NGN 2,500");
    expect(pdf).toContain("TOTAL PAID: NGN 2,500");
    expect(pdf.endsWith("%%EOF\n")).toBe(true);

    const xrefOffset = Number(pdf.match(/startxref\n(\d+)\n%%EOF/)?.[1]);
    expect(pdf.slice(xrefOffset, xrefOffset + 5)).toBe("xref\n");
    const xrefEntries = pdf.slice(xrefOffset).split("\n").slice(3, 8);
    for (let objectNumber = 1; objectNumber <= 5; objectNumber++) {
      const offset = Number(xrefEntries[objectNumber - 1].slice(0, 10));
      expect(pdf.slice(offset)).toMatch(new RegExp(`^${objectNumber} 0 obj\\n`));
    }
  });

  it("downloads an application/pdf Blob with a sanitized .pdf filename", () => {
    jest.useFakeTimers();
    const createObjectURL = jest.fn(() => "blob:receipt-pdf");
    const revokeObjectURL = jest.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    downloadReceiptPdf(receipt, "receipt/../../order:123");

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe("application/pdf");
    expect(click).toHaveBeenCalledTimes(1);
    const link = click.mock.instances[0] as HTMLAnchorElement;
    expect(link.download).toBe("receipt-..-..-order-123.pdf");
    expect(link.href).toBe("blob:receipt-pdf");

    jest.advanceTimersByTime(1000);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:receipt-pdf");
  });
});
