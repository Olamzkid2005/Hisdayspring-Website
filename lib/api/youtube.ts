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
 * Fetch recent sermons from YouTube channel
 */
export async function fetchSermons(
  maxResults: number = 6
): Promise<YouTubeVideo[]> {
  const apiKey = config.youtubeApiKeyPublic;

  if (!apiKey) {
    console.warn("YouTube API key not configured. Using placeholder data.");
    return getPlaceholderSermons();
  }

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
 * Placeholder sermons when API is not available
 */
function getPlaceholderSermons(): YouTubeVideo[] {
  return [
    {
      id: "placeholder-1",
      videoId: "dQw4w9WgXcQ",
      title: "Walking in Divine Favor - Sunday Service",
      description: "Experience the power of divine favor in your life journey.",
      thumbnailUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
      publishedAt: new Date().toISOString(),
    },
    {
      id: "placeholder-2",
      videoId: "dQw4w9WgXcQ",
      title: "The Power of Prevailing Prayer",
      description: "Discover how to pray effectively and see results.",
      thumbnailUrl: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "placeholder-3",
      videoId: "dQw4w9WgXcQ",
      title: "Keys to Kingdom Prosperity",
      description: "Biblical principles for financial breakthrough and blessing.",
      thumbnailUrl: "https://images.unsplash.com/photo-1478144592103-25e218a04891?w=800&q=80",
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "placeholder-4",
      videoId: "dQw4w9WgXcQ",
      title: "Youth Summit 2026 - Rising Generation",
      description: "Inspiring message for the youth to rise and fulfill their destiny.",
      thumbnailUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "placeholder-5",
      videoId: "dQw4w9WgXcQ",
      title: "Midweek Bible Study - Book of Philippians",
      description: "Deep dive into the Word for spiritual growth.",
      thumbnailUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
      publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "placeholder-6",
      videoId: "dQw4w9WgXcQ",
      title: "Thanksgiving Service Highlights",
      description: "Celebrating God's faithfulness and blessings.",
      thumbnailUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}
