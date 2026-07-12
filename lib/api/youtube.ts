/**
 * YouTube API client for fetching sermons
 * Uses client-side public API key for sermon fetching
 */

import type { YouTubeVideo, LiveStreamStatus } from "@/types";
import { config } from "@/lib/config";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

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
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

/**
 * Fetch recent sermons from YouTube channel.
 * Uses YouTube Data API when a key is configured,
 * otherwise falls back to hardcoded placeholders with real YouTube thumbnails.
 */
export async function fetchSermons(
  maxResults: number = 6
): Promise<YouTubeVideo[]> {
  const apiKey = config.youtubeApiKeyPublic;

  if (apiKey) {
    try {
      // First, search for videos in the channel
      const searchUrl = `${YOUTUBE_API_BASE}/search?key=${apiKey}&channelId=@hisdayspring&part=snippet&order=date&type=video&maxResults=${maxResults}`;

      const response = await fetchWithRetry(searchUrl, 3);

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const searchData: YouTubeSearchResponse = await response.json();

      if (!searchData.items || searchData.items.length === 0) {
        return getPlaceholderSermons();
      }

      // Get video details (duration, view count)
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

      // Map to our type
      const videos: YouTubeVideo[] = searchData.items.map((item) => {
        const videoDetails = videoData.items.find(
          (v) => v.contentDetails
        );

        return {
          id: item.id.videoId || "",
          videoId: item.id.videoId || "",
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url,
          publishedAt: item.snippet.publishedAt,
          duration: videoDetails?.contentDetails.duration,
          viewCount: videoDetails?.statistics.viewCount,
        };
      });

      return videos;
    } catch (error) {
      console.error("Error fetching sermons:", error);
      return getPlaceholderSermons();
    }
  }

  console.warn("YouTube API key not configured. Using placeholder data with real YouTube thumbnails.");
  return getPlaceholderSermons();
}

/**
 * Fetch live stream status
 * This should only be called from server-side API routes
 */
export async function fetchLiveStreamStatus(): Promise<LiveStreamStatus> {
  // This would be called from /api/livestream route
  // For now, return offline status
  return {
    isLive: false,
  };
}

/**
 * Retry a fetch with exponential backoff
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
      // Exponential backoff: 1s, 2s, 4s
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
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
function getPlaceholderSermons(): YouTubeVideo[] {
  return [
    {
      id: "06DxTU6V5uU",
      videoId: "06DxTU6V5uU",
      title: "Lust: That Unholy Crave You Have to Deal With",
      description: "Pastor Blessing shares how God dealt with his crave for manifestation of powers, keeping him away from attending any church event for seven years.",
      thumbnailUrl: "https://i.ytimg.com/vi/06DxTU6V5uU/hqdefault.jpg",
      publishedAt: "2026-04-03T15:14:59+00:00",
    },
    {
      id: "Ex7_T-jxRxU",
      videoId: "Ex7_T-jxRxU",
      title: "Special Prayers for Mature Singles & Youth",
      description: "A time of prayer and fellowship with the youth and matured singles.",
      thumbnailUrl: "https://i.ytimg.com/vi/Ex7_T-jxRxU/hqdefault.jpg",
      publishedAt: "2026-05-07T06:12:07+00:00",
    },
    {
      id: "6joAQsN3zLQ",
      videoId: "6joAQsN3zLQ",
      title: "The Ikorodu Healing from Heaven Crusade",
      description: "A special invitation to you and your loved ones from Hisdayspring Family. Join us for a powerful time of the Word, prophetic encounters, deliverance, and healing.",
      thumbnailUrl: "https://i.ytimg.com/vi/6joAQsN3zLQ/hqdefault.jpg",
      publishedAt: "2026-05-12T16:33:08+00:00",
    },
    {
      id: "6Psq-dWrEqY",
      videoId: "6Psq-dWrEqY",
      title: "Thanksgiving Sunday Service Highlights",
      description: 'The "Repeat After Me" segment of Sunday\'s Thanksgiving funside.',
      thumbnailUrl: "https://i.ytimg.com/vi/6Psq-dWrEqY/hqdefault.jpg",
      publishedAt: "2026-05-05T06:14:25+00:00",
    },
    {
      id: "U0HrHuSIWms",
      videoId: "U0HrHuSIWms",
      title: "Abuja City Gathering - A New Dawn",
      description: "Join our Abuja City Gathering as we enter into a new dawn in Jesus' name.",
      thumbnailUrl: "https://i.ytimg.com/vi/U0HrHuSIWms/hqdefault.jpg",
      publishedAt: "2026-04-10T23:17:10+00:00",
    },
    {
      id: "4rtYaooDJaw",
      videoId: "4rtYaooDJaw",
      title: "Blessing Conference 2026 - Lives Changed",
      description: "3 days. 1 Word. Lives Changed. The Blessing Conference 2026 - June 5-7.",
      thumbnailUrl: "https://i.ytimg.com/vi/4rtYaooDJaw/hqdefault.jpg",
      publishedAt: "2026-05-21T09:03:30+00:00",
    },
  ];
}
