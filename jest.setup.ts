import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    section: "section",
    button: "button",
    span: "span",
    nav: "nav",
    ul: "ul",
    li: "li",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    p: "p",
    a: "a",
    img: "img",
    form: "form",
    input: "input",
    label: "label",
    textarea: "textarea",
  },
  useInView: jest.fn(() => true),
  useScroll: jest.fn(() => ({ scrollY: 0 })),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/link
jest.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    const { createElement } = require("react");
    return createElement("a", { href, ...props }, children);
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
