import { render, screen, fireEvent, act } from "@testing-library/react";

jest.mock("@/components/ui", () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    const { createElement } = require("react");
    return createElement("button", { onClick }, children);
  },
}));

jest.mock("lucide-react", () => ({
  __esModule: true,
  Cookie: "span",
  X: "span",
}));

jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: { div: "div" },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    const { createElement } = require("react");
    return createElement("a", { href }, children);
  },
}));

import { CookieConsent } from "@/components/utility/CookieConsent";

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the banner after the initial delay and accepts cookies", () => {
    render(<CookieConsent />);
    expect(screen.queryByText("We value your privacy")).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByText("We value your privacy")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Accept All Cookies" }));
    expect(JSON.parse(localStorage.getItem("hisdayspring_cookie_consent")!)).toMatchObject({
      analytics: true,
      marketing: true,
    });
    expect(screen.queryByText("We value your privacy")).not.toBeInTheDocument();
  });

  it("does not show the banner when consent was already stored", () => {
    localStorage.setItem(
      "hisdayspring_cookie_consent",
      JSON.stringify({ analytics: false, marketing: false, timestamp: "2026-09-01" })
    );
    render(<CookieConsent />);

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.queryByText("We value your privacy")).not.toBeInTheDocument();
  });
});
