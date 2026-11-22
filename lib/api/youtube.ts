/**
 * YouTube API client for fetching sermons
 * Uses client-side public API key for sermon fetching
 */

import type { YouTubeVideo } from "@/types";
import { config } from "@/lib/config";
import { YOUTUBE_API_BASE, YOUTUBE_CHANNEL_ID } from "./youtube-config";

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubeSearchItem {
  id: {
    videoId?: string;
    kind: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
      medium: { url: string };
      default: { url: string };
    };
    publishedAt: string;
  };
}

interface YouTubeVideoResponse {
  items: YouTubeVideoItem[];
}

interface YouTubeVideoItem {
  id: string;
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

/**
 * Fetch recent sermons from YouTube channel.
 *
 * The Data API is used when a key is configured, because it is the only source
 * that carries a duration. Without a key the channel feed is used, which needs
 * no key and is why the list keeps itself current on a deployment that was
 * never given one. The bundled list is the last resort if both fail.
 */
export async function fetchSermons(
  maxResults: number = 6
): Promise<YouTubeVideo[]> {
  const apiKey = config.youtubeApiKeyPublic;

  if (apiKey) {
    const fromApi = await fetchSermonsFromApi(apiKey, maxResults);
    if (fromApi.length > 0) return fromApi;
  }

  const fromFeed = await fetchSermonsFromFeed(maxResults);
  if (fromFeed.length > 0) return fromFeed;

  return getPlaceholderSermons();
}

/**
 * The Data API path: two upstream calls, the second for durations and views.
 * Returns an empty list on any failure so the caller can fall back.
 */
async function fetchSermonsFromApi(
  apiKey: string,
  maxResults: number
): Promise<YouTubeVideo[]> {
  try {
    const searchUrl = `${YOUTUBE_API_BASE}/search?key=${apiKey}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=${maxResults}`;

    const response = await fetchWithRetry(searchUrl, 2);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const searchData: YouTubeSearchResponse = await response.json();
    if (!searchData.items || searchData.items.length === 0) return [];

    const videoIds = searchData.items
      .map((item) => item.id.videoId)
      .filter(Boolean)
      .join(",");

    const videoUrl = `${YOUTUBE_API_BASE}/videos?key=${apiKey}&id=${videoIds}&part=contentDetails,statistics`;

    let videoData: YouTubeVideoResponse = { items: [] };
    try {
      const videoResponse = await fetch(videoUrl);
      if (videoResponse.ok) {
        videoData = await videoResponse.json();
      }
    } catch {
      // Continue without video details
    }

    // Details are matched by id. Taking the first item that had details gave
    // every sermon the first video's duration and view count.
    const detailsById = new Map(
      (videoData.items ?? []).map((item) => [item.id, item])
    );

    return searchData.items.map((item) => {
      const videoId = item.id.videoId || "";
      const details = detailsById.get(videoId);

      return {
        id: videoId,
        videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        duration: details?.contentDetails?.duration,
        viewCount: details?.statistics?.viewCount,
      };
    });
  } catch (error) {
    console.error("Error fetching sermons from the YouTube API:", error);
    return [];
  }
}

/**
 * Read the newest uploads through this site's own route, which reads the
 * channel feed on the server. Returns an empty list when the route is
 * unreachable so the caller can fall back to the API or the bundled list.
 */
async function fetchSermonsFromFeed(
  maxResults: number
): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch("/api/sermons", { cache: "no-store" });
    if (!response.ok) return [];

    const data: { videos?: YouTubeVideo[] } = await response.json();
    const videos = data.videos ?? [];
    return videos.slice(0, maxResults);
  } catch {
    return [];
  }
}

/**
 * Retry a fetch with a short backoff.
 *
 * Two attempts, 400ms and 800ms apart. The visitor is looking at a skeleton
 * while this runs, and the feed behind it can answer immediately, so a long
 * backoff only delays a fallback that was going to work.
 */
async function fetchWithRetry(
  url: string,
  maxRetries: number
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      await new Promise((resolve) =>
        setTimeout(resolve, 400 * Math.pow(2, i))
      );
    }
  }

  throw lastError || new Error("Failed after retries");
}

/**
 * Placeholder sermons when API is not available.
 * Uses real YouTube video IDs from the channel so thumbnails
 * are served directly from YouTube's CDN (no API key needed).
 */
/**
 * Bundled snapshot of the channel's newest uploads, used only when both the
 * feed and the Data API are unreachable. It is a fallback, not the source of
 * truth: the list above it is fetched fresh every fifteen minutes.
 */
function getPlaceholderSermons(): YouTubeVideo[] {
  return [
    {
      id: "Ph1TTTJb4JQ",
      videoId: "Ph1TTTJb4JQ",
      title: "KINGDOM HARVEST | SUNDAY (2ND) SERVICE | 22/11/2026.",
      description: "KINGDOM HARVEST | SUNDAY (2ND) SERVICE | 22/11/2026.",
      thumbnailUrl: "https://i.ytimg.com/vi/Ph1TTTJb4JQ/hqdefault.jpg",
      publishedAt: "2026-11-22T10:03:20+00:00",
    },
    {
      id: "c_-YRsXvy7M",
      videoId: "c_-YRsXvy7M",
      title: "KINGDOM HARVEST | SUNDAY (2ND) SERVICE | 22/11/2026.",
      description: "KINGDOM HARVEST | SUNDAY (2ND) SERVICE | 22/11/2026.",
      thumbnailUrl: "https://i.ytimg.com/vi/c_-YRsXvy7M/hqdefault.jpg",
      publishedAt: "2026-11-22T09:55:31+00:00",
    },
    {
      id: "8YZzQ5oc_Dg",
      videoId: "8YZzQ5oc_Dg",
      title: "WHO TAKES CARE OF THE MAN | YOUTH & SINGLES | SUNDAY (1ST) SERVICE | 12/11/2026.",
      description: "WHO TAKES CARE OF THE MAN | YOUTH & SINGLES | SUNDAY (1ST) SERVICE | 12/11/2026.",
      thumbnailUrl: "https://i.ytimg.com/vi/8YZzQ5oc_Dg/hqdefault.jpg",
      publishedAt: "2026-11-22T08:52:14+00:00",
    },
    {
      id: "kaOOnfyq_rw",
      videoId: "kaOOnfyq_rw",
      title: "WHO TAKES CARE OF THE MAN | YOUTH & SINGLES | SUNDAY (1ST) SERVICE | 12/11/2026.",
      description: "WHO TAKES CARE OF THE MAN | YOUTH & SINGLES | SUNDAY (1ST) SERVICE | 12/11/2026.",
      thumbnailUrl: "https://i.ytimg.com/vi/kaOOnfyq_rw/hqdefault.jpg",
      publishedAt: "2026-11-22T07:02:20+00:00",
    },
    {
      id: "ROiYxXP7zaI",
      videoId: "ROiYxXP7zaI",
      title: "27 DAYS TO LIGHT CONVENTION 2026!",
      description: "FROM CONTENTION TO REHOBOTH! GOD IS MAKING ROOM!",
      thumbnailUrl: "https://i.ytimg.com/vi/ROiYxXP7zaI/hqdefault.jpg",
      publishedAt: "2026-11-20T13:51:04+00:00",
    },
    {
      id: "CdawzcuI6dg",
      videoId: "CdawzcuI6dg",
      title: "LISTEN!! My Father, Provider, Keeper, Sustainer - Good Good Father To Me | 28 Days To LC’26",
      description: "28 DAYS TO GO to LIGHT CONVENTION 2026 - EXCEEDING MULTIPLICATION!",
      thumbnailUrl: "https://i.ytimg.com/vi/CdawzcuI6dg/hqdefault.jpg",
      publishedAt: "2026-11-19T14:10:21+00:00",
    },
  ];
}
