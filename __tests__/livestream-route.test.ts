jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { GET } from "@/app/api/livestream/route";

function mockFetch(...responses: Array<{ ok: boolean; status: number; body: unknown }>) {
  const fetchMock = jest.fn();
  responses.forEach(({ ok, status, body }) => {
    fetchMock.mockResolvedValueOnce({
      ok,
      status,
      json: async () => body,
    });
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: fetchMock,
  });
  return fetchMock;
}

describe("GET /api/livestream", () => {
  const originalApiKey = process.env.YOUTUBE_API_KEY;

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.YOUTUBE_API_KEY;
    else process.env.YOUTUBE_API_KEY = originalApiKey;
    jest.restoreAllMocks();
  });

  it("returns an offline response when YouTube is not configured", async () => {
    delete process.env.YOUTUBE_API_KEY;
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      isLive: false,
      message: "YouTube API key not configured",
    });
  });

  it("returns live stream details when the provider reports a live video", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    const fetchMock = mockFetch(
      {
        ok: true,
        status: 200,
        body: {
          items: [
            {
              id: { videoId: "live123", kind: "youtube#video" },
              snippet: {
                title: "Sunday Service Live",
                description: "Worship together",
                publishedAt: "2026-09-01T08:00:00Z",
                thumbnails: { high: { url: "https://img.test/live.jpg" } },
              },
            },
          ],
        },
      },
      {
        ok: true,
        status: 200,
        body: {
          items: [
            {
              statistics: { viewCount: "100" },
              liveStreamingDetails: {
                concurrentViewers: "42",
                activeLiveChatId: "chat123",
              },
            },
          ],
        },
      }
    );
    void fetchMock;

    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      isLive: true,
      videoId: "live123",
      viewerCount: 42,
      chatId: "chat123",
    });
  });

  it("returns a safe offline response when the provider fails", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    mockFetch({ ok: false, status: 503, body: "Service unavailable" });

    const response = await GET();
    await expect(response.json()).resolves.toEqual({
      isLive: false,
      message: "YouTube API error: 503",
    });
  });
});
