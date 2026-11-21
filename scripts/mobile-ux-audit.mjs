#!/usr/bin/env node
/**
 * Mobile UX audit — measures the things that actually break a phone visit:
 *
 *  - horizontal overflow (document vs viewport, and which elements stick out)
 *  - iOS zoom-on-focus: any input/select/textarea rendered under 16px
 *  - tap targets under 44x44 CSS px (Apple HIG; WCAG 2.2 AA asks 24x24)
 *  - how far down the primary task starts (hero height vs first field)
 *  - body text under 14px, and line lengths
 *  - anything covering the form at first paint (cookie banner, sticky bars)
 *
 * Usage: node scripts/mobile-ux-audit.mjs <url> [width,width,...]
 * Requires a Chrome started with --remote-debugging-port=9222.
 */
const url = process.argv[2] ?? "http://localhost:3000/testimonials";
const widths = (process.argv[3] ?? "360,390,414,768").split(",").map(Number);

const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((t) => t.type === "page");
if (!page) throw new Error("no page target — is Chrome running with --remote-debugging-port=9222?");

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  const r = pending.get(m.id);
  if (r) {
    pending.delete(m.id);
    r(m);
  }
});
await new Promise((res, rej) => {
  ws.addEventListener("open", res);
  ws.addEventListener("error", rej);
});
const send = (method, params = {}) => {
  const mid = ++id;
  const reply = new Promise((r) => pending.set(mid, r));
  ws.send(JSON.stringify({ id: mid, method, params }));
  return reply;
};
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
  return r.result.result.value;
};

// Runs in the page: everything measured against the live, laid-out DOM.
const probe = `(() => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const out = { viewport: { w: vw, h: vh } };

  out.overflow = {
    documentWidth: document.documentElement.scrollWidth,
    overflows: document.documentElement.scrollWidth > vw + 1,
    offenders: [],
  };
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      out.overflow.offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 70),
        left: Math.round(r.left),
        right: Math.round(r.right),
      });
    }
  }
  out.overflow.offenders = out.overflow.offenders.slice(0, 6);

  // iOS zooms the whole page when a focused control is under 16px.
  out.smallTextControls = [];
  for (const el of document.querySelectorAll("input:not([type=hidden]), select, textarea")) {
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 16) {
      out.smallTextControls.push({
        tag: el.tagName.toLowerCase(),
        name: el.name || el.id || "",
        fontSize: fs,
      });
    }
  }

  // Tap targets: real hit areas, ignoring visually-hidden helpers.
  out.smallTapTargets = [];
  for (const el of document.querySelectorAll("a[href], button, [role=radio], select, input[type=checkbox], input[type=radio]")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cls = (el.className || "").toString();
    if (/sr-only|skip-link/.test(cls)) continue;
    if (r.height < 44 || r.width < 44) {
      out.smallTapTargets.push({
        tag: el.tagName.toLowerCase(),
        label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
  }
  out.smallTapTargets = out.smallTapTargets.slice(0, 12);

  const hero = document.querySelector("section.relative");
  const heroRect = hero ? hero.getBoundingClientRect() : null;
  const firstField = document.querySelector("input[name=name], input#name, form input");
  const fieldRect = firstField ? firstField.getBoundingClientRect() : null;
  out.taskReach = {
    heroHeight: heroRect ? Math.round(heroRect.height) : null,
    heroShareOfViewport: heroRect ? +(heroRect.height / vh).toFixed(2) : null,
    firstFieldTop: fieldRect ? Math.round(fieldRect.top + window.scrollY) : null,
    // How many screenfuls until the visitor can start typing.
    screenfulsToFirstField: fieldRect ? +((fieldRect.top + window.scrollY) / vh).toFixed(2) : null,
  };

  // Anything fixed/sticky sitting over the form at first paint.
  out.covering = [];
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.height > vh * 0.6) continue; // full-height drawers are not banners
    out.covering.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 60),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 60),
    });
  }

  const body = getComputedStyle(document.body);
  out.baseFontSize = body.fontSize;

  const subheads = [...document.querySelectorAll("p, li")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.height > 0 && (el.textContent || "").trim().length > 60;
  });
  out.smallBodyText = subheads
    .map((el) => ({ fontSize: parseFloat(getComputedStyle(el).fontSize), text: (el.textContent || "").trim().slice(0, 40) }))
    .filter((x) => x.fontSize < 14)
    .slice(0, 6);

  return out;
})()`;

const report = [];
for (const width of widths) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: Math.round(width * 2.16),
    deviceScaleFactor: 3,
    mobile: true,
  });
  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 2200));
  // Walk the page so whileInView content is laid out before measuring.
  await evaluate(`(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  })()`);
  const data = await evaluate(probe);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  const { writeFile } = await import("node:fs/promises");
  const file = `artifacts/audit/mobile-${width}.png`;
  await writeFile(file, Buffer.from(shot.result.data, "base64"));
  report.push({ width, screenshot: file, ...data });
}

console.log(JSON.stringify(report, null, 2));
ws.close();
