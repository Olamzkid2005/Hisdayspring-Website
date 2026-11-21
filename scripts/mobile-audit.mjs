/**
 * Mobile audit helper — drives headless Chrome over CDP.
 *
 * `chrome --headless --screenshot --window-size=390,…` lays the page out at
 * Chrome's default viewport and then crops the image to 390px, which looks
 * exactly like a horizontal-overflow bug on every page. This script applies a
 * real device-metrics override first, so the numbers it reports are the ones a
 * phone would produce.
 *
 * Usage (with Chrome already listening on 9222):
 *   node scripts/mobile-audit.mjs <url> [width]
 *
 * Prints the document/viewport widths, every element wider than the viewport,
 * and writes a screenshot next to this script's output path.
 */

const url = process.argv[2];
const width = Number(process.argv[3] ?? 390);

if (!url) {
  console.error("usage: node scripts/mobile-audit.mjs <url> [width]");
  process.exit(1);
}

const CDP = "http://127.0.0.1:9222";

async function newTarget(targetUrl) {
  const response = await fetch(`${CDP}/json/new?${encodeURIComponent(targetUrl)}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error(`cannot open tab: ${response.status}`);
  return response.json();
}

function connect(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const resolver = pending.get(message.id);
    if (resolver) {
      pending.delete(message.id);
      resolver(message);
    }
  });

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", () => resolve());
    socket.addEventListener("error", reject);
  });

  const send = async (method, params = {}) => {
    await ready;
    const messageId = ++id;
    const reply = new Promise((resolve) => pending.set(messageId, resolve));
    socket.send(JSON.stringify({ id: messageId, method, params }));
    return reply;
  };

  return { send, close: () => socket.close() };
}

const target = await newTarget(url);
const { send, close } = connect(target.webSocketDebuggerUrl);

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});

// Fonts and the client bundle need a moment; the report is worthless otherwise.
await new Promise((resolve) => setTimeout(resolve, 2500));

const script = `(() => {
  const vw = document.documentElement.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("body *")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    if (rect.right > vw + 1 || rect.left < -1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute("class") || "").slice(0, 90),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      });
    }
  }
  return JSON.stringify({
    viewport: vw,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    overflows: document.documentElement.scrollWidth > vw,
    offenders: offenders.slice(0, 25),
    h1: [...document.querySelectorAll("h1")].map((n) => n.textContent.trim()),
  });
})()`;

const result = await send("Runtime.evaluate", { expression: script, returnByValue: true });
const report = JSON.parse(result.result?.result?.value ?? "{}");

console.log(JSON.stringify(report, null, 2));

const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
if (shot.result?.data) {
  const { writeFile } = await import("node:fs/promises");
  const path = new URL("../artifacts/audit/cdp-mobile.png", import.meta.url).pathname;
  await writeFile(path, Buffer.from(shot.result.data, "base64"));
  console.log(`screenshot: ${path}`);
}

close();
