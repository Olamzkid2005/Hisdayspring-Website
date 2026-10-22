export interface ReceiptPdfLine {
  label: string;
  amount?: number;
}

export interface ReceiptPdfDetails {
  title: string;
  reference: string;
  paidAt?: string;
  paymentMethod?: string;
  lines: ReceiptPdfLine[];
  total: number;
  note?: string;
}

function escapePdfText(value: string): string {
  return value
    .replace(/[^\x20-\x7e]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function formatNaira(amount: number): string {
  return `NGN ${amount.toLocaleString("en-NG")}`;
}

/** Create a self-contained, printable one-page receipt PDF using built-in fonts. */
export function createReceiptPdf(details: ReceiptPdfDetails): string {
  const textLines = [
    "HISDAYSPRING EVANGELICAL MINISTRY INTERNATIONAL",
    details.title,
    "",
    `Reference: ${details.reference}`,
    ...(details.paidAt ? [`Paid on: ${details.paidAt}`] : []),
    ...(details.paymentMethod ? [`Payment method: ${details.paymentMethod}`] : []),
    "",
    ...details.lines.map((line) =>
      line.amount === undefined
        ? line.label
        : `${line.label} - ${formatNaira(line.amount)}`
    ),
    "",
    `TOTAL PAID: ${formatNaira(details.total)}`,
    ...(details.note ? ["", details.note] : []),
    "",
    "Thank you for supporting the ministry.",
  ];

  const commands = ["BT", "/F1 11 Tf", "50 790 Td", "14 TL"];
  textLines.forEach((line, index) => {
    if (index === 0) commands.push("/F1 13 Tf");
    else if (index === 1) commands.push("/F1 12 Tf");
    else if (index === 2) commands.push("/F1 11 Tf");
    commands.push(`(${escapePdfText(line)}) Tj`, "T*");
  });
  commands.push("ET");
  const stream = commands.join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index++) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index++) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return pdf;
}

/** Trigger a browser download with the correct PDF media type and extension. */
export function downloadReceiptPdf(
  details: ReceiptPdfDetails,
  filename: string
): void {
  const pdf = createReceiptPdf(details);
  // Receipt text is normalized to ASCII in escapePdfText, so one character is
  // exactly one PDF byte. Blob handles the filename/transport in all browsers.
  const pdfBytes = new Uint8Array(Array.from(pdf, (character) => character.charCodeAt(0)));
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename.replace(/[^A-Za-z0-9._-]/g, "-")}.pdf`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
