/**
 * The testimony page's length strategy.
 *
 * A `wa.me?text=` URL is silently truncated by mobile browsers past ~2,000
 * encoded characters, which would deliver half a testimony. These tests pin
 * the boundary: short submissions travel inside the URL, long ones travel via
 * the clipboard, and the switch happens exactly once as the text grows.
 */

import {
  buildClipboardHintMessage,
  buildTestimonyEmailUrl,
  buildTestimonyMessage,
  buildWhatsAppUrl,
  planTestimonyDelivery,
  whatsappDigits,
  WHATSAPP_URL_SAFE_LIMIT,
  type TestimonySubmission,
} from "@/lib/testimony";
import { TESTIMONY_WHATSAPP_NUMBER } from "@/data/testimony";

const base: TestimonySubmission = {
  name: "Grace O.",
  phone: "+2348000000000",
  branch: "Ipaja (Headquarters)",
  publish: true,
  testimony: "God healed my mother after three years of prayer. To Him be glory.",
};

function withTestimony(length: number): TestimonySubmission {
  return { ...base, testimony: "a".repeat(length) };
}

describe("whatsappDigits", () => {
  it("strips a leading + and every separator", () => {
    expect(whatsappDigits("+234 708 516 7576")).toBe("2347085167576");
    expect(whatsappDigits(TESTIMONY_WHATSAPP_NUMBER)).toBe("2347085167576");
  });
});

describe("buildTestimonyMessage", () => {
  it("leads with the church, the sender and the publish permission", () => {
    const message = buildTestimonyMessage(base);
    const lines = message.split("\n");

    expect(lines[0]).toBe("*TESTIMONY*: Hisdayspring");
    expect(message).toContain("Name: Grace O.");
    expect(message).toContain("Phone: +2348000000000");
    expect(message).toContain("Branch: Ipaja (Headquarters)");
    expect(message).toContain("Share publicly: Yes");
    expect(message).toContain(base.testimony);
  });

  it("omits optional lines instead of leaving empty labels", () => {
    const message = buildTestimonyMessage({
      ...base,
      phone: "",
      branch: "",
      publish: false,
    });

    expect(message).not.toContain("Phone:");
    expect(message).not.toContain("Branch:");
    expect(message).toContain("Share publicly: No");
  });
});

describe("planTestimonyDelivery", () => {
  it("keeps a normal testimony inside the WhatsApp URL", () => {
    const plan = planTestimonyDelivery(base);

    expect(plan.mode).toBe("direct");
    expect(plan.url.startsWith("https://wa.me/2347085167576?text=")).toBe(true);
    expect(decodeURIComponent(plan.url.split("?text=")[1])).toBe(plan.message);
  });

  it("sends a long testimony through the clipboard and keeps the URL short", () => {
    const long = withTestimony(4000);
    const plan = planTestimonyDelivery(long);

    expect(plan.mode).toBe("clipboard");
    expect(plan.url.length).toBeLessThanOrEqual(WHATSAPP_URL_SAFE_LIMIT);
    // The full text is what goes to the clipboard, not the short header.
    expect(plan.message).toContain("a".repeat(4000));
    if (plan.mode === "clipboard") {
      expect(plan.hint).toMatch(/paste/i);
      expect(decodeURIComponent(plan.url)).toContain("follows below");
    }
  });

  it("switches from URL to clipboard exactly once as the text grows", () => {
    const modes = new Map<string, number>();
    let switches = 0;
    let previous = planTestimonyDelivery(withTestimony(1)).mode;

    for (let length = 2; length <= 4000; length += 7) {
      const mode = planTestimonyDelivery(withTestimony(length)).mode;
      modes.set(mode, (modes.get(mode) ?? 0) + 1);
      if (mode !== previous) switches += 1;
      previous = mode;
    }

    expect(switches).toBe(1);
    expect(modes.get("direct")).toBeGreaterThan(0);
    expect(modes.get("clipboard")).toBeGreaterThan(0);
  });

  it("never emits a URL above the safe limit, at any length", () => {
    for (const length of [0, 10, 100, 500, 900, 1200, 2000, 3000, 4000]) {
      const plan = planTestimonyDelivery(withTestimony(length));
      expect(plan.url.length).toBeLessThanOrEqual(WHATSAPP_URL_SAFE_LIMIT);
    }
  });

  it("honours an explicit number override", () => {
    const plan = planTestimonyDelivery(base, "+234 800 111 2222");
    expect(plan.url).toContain("wa.me/2348001112222?text=");
  });
});

describe("buildClipboardHintMessage", () => {
  it("carries the header without the testimony body", () => {
    const hint = buildClipboardHintMessage(withTestimony(4000));

    expect(hint).toContain("Name: Grace O.");
    expect(hint).toContain("Share publicly: Yes");
    expect(hint).not.toContain("a".repeat(100));
  });
});

describe("buildWhatsAppUrl", () => {
  it("percent-encodes newlines so the link survives a browser open", () => {
    const url = buildWhatsAppUrl("+2347085167576", "line one\nline two");
    expect(url).toContain("%0A");
  });
});

describe("buildTestimonyEmailUrl", () => {
  it("opens the church mailbox with a recognisable subject and the plain body", () => {
    const url = buildTestimonyEmailUrl(base);
    const decoded = decodeURIComponent(url);

    expect(url.startsWith("mailto:hello@hisdayspring.org?subject=")).toBe(true);
    expect(decoded).toContain("Testimony from Grace O.");
    expect(decoded).toContain(base.testimony);
    // WhatsApp markdown means nothing in an email.
    expect(decoded).not.toContain("*TESTIMONY*");
  });
});
