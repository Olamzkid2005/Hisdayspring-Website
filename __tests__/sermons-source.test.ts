jest.mock("@/lib/config", () => ({ config: { youtubeApiKeyPublic: "" } }));

import { fetchSermons } from "@/lib/api/youtube";
import { config } from "@/lib/config";

const mutableConfig = config as { youtubeApiKeyPublic: string };

const FEED = `<feed>
 <entry>
  <yt:videoId>feedVideo1</yt:videoId>
  <title>Feed sermon</title>
  <published>2026-11-22T09:55:31+00:00</published>
  <media:group>
   <media:description>From the feed</media:description>
   <media:community><media:statistics views="19"/></media:community>
  </media:group>
 </entry>
</feed>`;

function routeFetch(routes: Array<{ match: RegExp; ok?: boolean; body: unknown }>) {
  const fetchMock = jest.fn(async (url: string | URL) => {
    const href = String(url);
    for (const route of routes) {
      if (route.match.test(href)) {
        const ok = route.ok ?? true;
        return {
          ok,
          status: ok ? 200 : 500,
          json: async () => route.body,
          text: async () => String(route.body),
        };
      }
    }
    throw new Error(`unexpected fetch ${href}`);
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
  return fetchMock;
}

const searchBody = {
  items: [
    {
      id: { videoId: "videoA" },
      snippet: {
        title: "First sermon",
        description: "first",
        publishedAt: "2026-11-22T10:00:00+00:00",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/videoA/hqdefault.jpg" } },
      },
    },
    {
      id: { videoId: "videoB" },
      snippet: {
        title: "Second sermon",
        description: "second",
        publishedAt: "2026-11-15T10:00:00+00:00",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/videoB/hqdefault.jpg" } },
      },
    },
  ],
};

describe("fetchSermons", () => {
  afterEach(() => {
    mutableConfig.youtubeApiKeyPublic = "";
  });

  it("gives each video its own duration and view count", async () => {
    mutableConfig.youtubeApiKeyPublic = "KEY";
    routeFetch([
      { match: /\/search\?/, body: searchBody },
      {
        match: /\/videos\?/,
        // Deliberately out of order, the way YouTube does not promise an order.
        body: {
          items: [
            {
              id: "videoB",
              contentDetails: { duration: "PT1H2M" },
              statistics: { viewCount: "222" },
            },
            {
              id: "videoA",
              contentDetails: { duration: "PT45M" },
              statistics: { viewCount: "111" },
            },
          ],
        },
      },
    ]);

    const videos = await fetchSermons(2);

    // Matching by position, or by "first item with details", gave both videos
    // videoA's numbers.
    expect(videos.map((video) => [video.videoId, video.duration, video.viewCount])).toEqual([
      ["videoA", "PT45M", "111"],
      ["videoB", "PT1H2M", "222"],
    ]);
  });

  it("asks the feed route first when no key is configured", async () => {
    const fetchMock = routeFetch([{ match: /\/api\/sermons/, body: { videos: [] } }]);

    await fetchSermons(1);

    // With no key the feed route is the first thing asked, not the placeholders.
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/sermons");
  });

  it("falls back to the channel feed when the API returns nothing", async () => {
    mutableConfig.youtubeApiKeyPublic = "KEY";
    routeFetch([
      { match: /\/search\?/, body: { items: [] } },
      { match: /\/api\/sermons/, body: { videos: [] } },
    ]);

    const videos = await fetchSermons(2);

    // The bundled list, since neither source answered usefully.
    expect(videos[0].videoId).toBe("Ph1TTTJb4JQ");
  });

  it("returns the bundled list when both sources fail", async () => {
    mutableConfig.youtubeApiKeyPublic = "KEY";
    routeFetch([
      { match: /\/search\?/, ok: false, body: "" },
      { match: /\/api\/sermons/, ok: false, body: "" },
    ]);

    const videos = await fetchSermons(6);

    expect(videos).toHaveLength(6);
    expect(videos[0].publishedAt.startsWith("2026-11")).toBe(true);
  });

  it("takes the feed's videos when the feed answers", async () => {
    routeFetch([{ match: /\/api\/sermons/, body: { videos: [
      {
        id: "feedVideo1",
        videoId: "feedVideo1",
        title: "Feed sermon",
        description: "From the feed",
        thumbnailUrl: "https://i.ytimg.com/vi/feedVideo1/hqdefault.jpg",
        publishedAt: "2026-11-22T09:55:31+00:00",
        viewCount: "19",
      },
    ] } }]);

    const videos = await fetchSermons(1);

    expect(videos[0].videoId).toBe("feedVideo1");
  });

  it("ignores an unreachable feed route and keeps a usable list", async () => {
    routeFetch([{ match: /\/api\/sermons/, ok: false, body: "" }]);

    const videos = await fetchSermons(6);

    expect(videos.length).toBeGreaterThan(0);
  });
});
