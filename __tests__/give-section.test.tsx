/**
 * The homepage giving section shows the church accounts directly, so a donor
 * can copy the details without opening /giving. These tests pin the parts that
 * would quietly mislead: the wrong string on the clipboard, feedback that
 * appears on the wrong button, and a copy that fails without saying so.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GiveSection } from "@/components/sections/GiveSection";
import { bankAccounts, formatBankDetails } from "@/data/donations";

function mockClipboard() {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

describe("homepage giving section", () => {
  afterEach(() => jest.restoreAllMocks());

  it("shows every church account with its number and name", () => {
    render(<GiveSection />);

    bankAccounts.forEach((bank) => {
      expect(screen.getByText(bank.accountNumber)).toBeInTheDocument();
      expect(screen.getByText(bank.bankName)).toBeInTheDocument();
    });
  });

  it("copies an account number", async () => {
    const writeText = mockClipboard();
    const bank = bankAccounts[0];

    render(<GiveSection />);
    fireEvent.click(
      screen.getByRole("button", { name: `Copy ${bank.bankName} account number` })
    );

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(bank.accountNumber));
  });

  it("copies the bank name, account number and account name in one paste", async () => {
    const writeText = mockClipboard();
    const bank = bankAccounts[1];

    render(<GiveSection />);
    fireEvent.click(
      screen.getByRole("button", { name: `Copy ${bank.bankName} bank details` })
    );

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0][0]).toBe(formatBankDetails(bank));
  });

  it("confirms only the button that was pressed", async () => {
    mockClipboard();

    render(<GiveSection />);
    fireEvent.click(
      screen.getByRole("button", {
        name: `Copy ${bankAccounts[0].bankName} account number`,
      })
    );

    await waitFor(() => expect(screen.getByText("Copied")).toBeInTheDocument());
    // Without per-button keys every copy button on the card would tick at once.
    expect(screen.getAllByText("Copied")).toHaveLength(1);
  });

  it("says so when the browser refuses to copy", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: jest.fn().mockRejectedValue(new Error("denied")) },
    });

    render(<GiveSection />);
    fireEvent.click(
      screen.getByRole("button", {
        name: `Copy ${bankAccounts[0].bankName} account number`,
      })
    );

    await waitFor(() =>
      expect(screen.getByText(/could not copy automatically/i)).toBeInTheDocument()
    );
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
  });
});
