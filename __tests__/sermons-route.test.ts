jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { GET, revalidate } from "@/app/api/sermons/route";
import { FEED_REVALIDATE_SECONDS, parseChannelFeed } from "@/lib/api/youtube-feed";

/** A real-shaped slice of the channel feed, including the awkward bits. */
const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
 <title>Hisdayspring Evangelical Ministries International</title>
 <entry>
  <id>yt:video:c_-YRsXvy7M</id>
  <yt:videoId>c_-YRsXvy7M</yt:videoId>
  <title>KINGDOM HARVEST | SUNDAY (2ND) SERVICE | 22/11/2026.</title>
  <published>2026-11-22T09:55:31+00:00</published>
  <media:group>
   <media:thumbnail url="https://i4.ytimg.com/vi/c_-YRsXvy7M/hqdefault.jpg" width="480" height="360"/>
   <media:description>KINGDOM HARVEST | SUNDAY (2ND) SERVICE.

For Tithes and Offerings.</media:description>
   <media:community>
    <media:statistics views="19"/>
   </media:community>
  </media:group>
 </entry>
 <entry>
  <id>yt:video:ROiYxXP7zaI</id>
  <yt:videoId>ROiYxXP7zaI</yt:videoId>
  <title>27 DAYS TO LIGHT CONVENTION 2026!</title>
  <published>2026-11-20T13:51:04+00:00</published>
  <media:group>
   <media:thumbnail url="https://i4.ytimg.com/vi/ROiYxXP7zaI/hqdefault.jpg" width="480" height="360"/>
   <media:description>FROM CONTENTION TO REHOBOTH &amp; ROOM!</media:description>
   <media:community>
    <media:statistics views="685"/>
   </media:community>
  </media:group>
 </entry>
</feed>`;

function mockFetchOnce(response: { ok: boolean; status?: number; body?: string }) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    text: async () => response.body ?? "",
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
  return fetchMock;
}

describe("parseChannelFeed", () => {
  it("reads the newest uploads with their dates, views and thumbnails", () => {
    const videos = parseChannelFeed(FEED);

    expect(videos).toHaveLength(2);
    expect(videos[0]).toMatchObject({
      videoId: "c_-YRsXvy7M",
      title: "KINGDOM HARVEST | SUNDAY (2ND) SERVICE | 22/11/2026.",
      publishedAt: "2026-11-22T09:55:31+00:00",
      viewCount: "19",
    });
    expect(videos[0].thumbnailUrl).toContain("i.ytimg.com/vi/c_-YRsXvy7M/");
  });

  it("orders newest first even if the feed does not", () => {
    const reversed = FEED.replace(
      /(<entry>[\s\S]*?<\/entry>)(\s*)(<entry>[\s\S]*?<\/entry>)/,
      "$3$2$1"
    );
    const videos = parseChannelFeed(reversed);

    expect(videos.map((video) => video.videoId)).toEqual([
      "c_-YRsXvy7M",
      "ROiYxXP7zaI",
    ]);
  });

  it("decodes XML entities in titles and descriptions", () => {
    const [first] = parseChannelFeed(FEED, 1);
    expect(first.title).toContain("|");

    const second = parseChannelFeed(FEED).find(
      (video) => video.videoId === "ROiYxXP7zaI"
    );
    expect(second?.description).toBe("FROM CONTENTION TO REHOBOTH & ROOM!");
  });

  it("caps the list at the requested size", () => {
    expect(parseChannelFeed(FEED, 1)).toHaveLength(1);
  });

  it("returns nothing for a feed with no entries", () => {
    expect(parseChannelFeed("<feed></feed>")).toEqual([]);
  });
});

describe("GET /api/sermons", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns the channel's videos", async () => {
    mockFetchOnce({ ok: true, body: FEED });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toBe("feed");
    expect(body.videos).toHaveLength(2);
    expect(body.videos[0].videoId).toBe("c_-YRsXvy7M");
  });

  it("answers 502 rather than an empty list when YouTube is down", async () => {
    mockFetchOnce({ ok: false, status: 503 });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.videos).toEqual([]);
  });

  it("answers 502 when the feed returns no entries", async () => {
    mockFetchOnce({ ok: true, body: "<feed></feed>" });

    const response = await GET();

    expect(response.status).toBe(502);
  });
});

describe("the sermons route cache", () => {
  it("revalidates on the same rhythm as the feed fetch", () => {
    // The literal in the route is what Next reads; this keeps it honest if
    // either number is ever changed on its own.
    expect(revalidate).toBe(FEED_REVALIDATE_SECONDS);
  });
});
