import { formatLagosDateTime, lagosToday, nextSundayServiceLabel } from "@/lib/lagos-time";

describe("lagos-time", () => {
  // The church runs on Lagos wall-clock time (UTC+1). These assertions pass
  // whatever timezone the test machine is in.
  it("reports today's date in Lagos, not the visitor's date", () => {
    // 23:30 UTC is still 10 Oct for a US visitor, but already 11 Oct in Lagos.
    expect(lagosToday(new Date("2026-10-10T23:30:00Z"))).toBe("2026-10-11");
    expect(lagosToday(new Date("2026-10-10T22:59:00Z"))).toBe("2026-10-10");
  });

  it("names the Sunday that has already started in Lagos", () => {
    // 03:00 UTC Sunday = 04:00 Sunday in Lagos, but still 23:00 Saturday in
    // New York — the service on today's date is the upcoming one.
    expect(nextSundayServiceLabel(new Date("2026-10-11T03:00:00Z"))).toBe(
      "Sunday, October 11"
    );
  });

  it("stamps receipts in Lagos time, labelled", () => {
    // 03:02 UTC on 26 Sep is 04:02 in Lagos — and 23:02 the previous day in New
    // York, which is what staff would otherwise be reconciling against.
    const stamp = formatLagosDateTime("2026-09-26T03:02:31.586714Z");

    expect(stamp).toContain("26 Sept 2026");
    expect(stamp).toContain("04:02");
    expect(stamp.endsWith("(Lagos)")).toBe(true);
  });

  it("rolls forward to the next Sunday once the Lagos service day has passed", () => {
    // 12:00 UTC Sunday = 13:00 Lagos Sunday... still Sunday; and by Monday it
    // must move on a week.
    expect(nextSundayServiceLabel(new Date("2026-10-12T09:00:00Z"))).toBe(
      "Sunday, October 18"
    );
  });
});
