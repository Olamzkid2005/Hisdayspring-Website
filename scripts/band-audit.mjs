/**
 * Prints the background-colour bands of pages, top to bottom.
 *
 * "Make it consistent with the other pages" needs a definition of what the
 * other pages actually do, so this reads computed styles rather than classes —
 * a `bg-surface-container-low` that is overridden still reports its real colour.
 *
 * Usage (Chrome listening on 9222, dev/prod server up):
 *   node scripts/band-audit.mjs http://localhost:3100 / /pastors /testimonials
 */

const origin = process.argv[2];
const routes = process.argv.slice(3);

if (!origin || routes.length === 0) {
  console.error("usage: node scripts/band-audit.mjs <origin> <route> [route…]");
  process.exit(1);
}

const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((target) => target.type === "page");
if (!page) throw new Error("no page target");

const socket = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const resolve = pending.get(message.id);
  if (resolve) {
    pending.delete(message.id);
    resolve(message);
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve);
  socket.addEventListener("error", reject);
});

function send(method, params = {}) {
  const messageId = ++id;
  const reply = new Promise((resolve) => pending.set(messageId, resolve));
  socket.send(JSON.stringify({ id: messageId, method, params }));
  return reply;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const sample = `(() => {
  const bands = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("body section, body div, body main")) {
    const rect = el.getBoundingClientRect();
    const bg = getComputedStyle(el).backgroundColor;
    if (rect.height < 40) continue;
    if (bg === "rgba(0, 0, 0, 0)") continue;
    const top = Math.round(rect.top + window.scrollY);
    const key = top + bg;
    if (seen.has(key)) continue;
    seen.add(key);
    bands.push({ top, height: Math.round(rect.height), bg, cls: (el.className || "").toString().slice(0, 60) });
  }
  bands.sort((a, b) => a.top - b.top);
  // Only the outer-most band per offset matters: drop children nested inside a
  // parent that already covers them.
  const outer = [];
  for (const band of bands) {
    const covered = outer.some(
      (parent) => band.top >= parent.top && band.top < parent.top + parent.height && band.bg === parent.bg
    );
    if (!covered) outer.push(band);
  }
  return JSON.stringify(outer.slice(0, 12));
})()`;

for (const route of routes) {
  await send("Page.navigate", { url: `${origin}${route}` });
  await new Promise((resolve) => setTimeout(resolve, 2200));
  const result = await send("Runtime.evaluate", { expression: sample, returnByValue: true });
  const bands = JSON.parse(result.result?.result?.value ?? "[]");

  console.log(`\n${route}`);
  for (const band of bands) {
    console.log(
      `  y=${String(band.top).padStart(5)}  h=${String(band.height).padStart(4)}  ${band.bg.padEnd(22)} ${band.cls}`
    );
  }
}

socket.close();
