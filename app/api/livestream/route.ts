/**
 * YouTube Live Stream Status API Route
 * Server-side route that checks if the channel is currently live
 * Protects the server-side YouTube API key from client exposure
 */

import { NextResponse } from "next/server";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  kind: string;
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
    kind: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
    };
  };
  liveStreamingDetails?: {
    concurrentViewers?: string;
    activeLiveChatId?: string;
  };
}

interface YouTubeVideoResponse {
  items: YouTubeVideoItem[];
}

interface YouTubeVideoItem {
  statistics: {
    viewCount: string;
    concurrentViewers?: string;
  };
  liveStreamingDetails?: {
    concurrentViewers?: string;
    activeLiveChatId?: string;
  };
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || "@hisdayspring";

  // If no API key, return offline status
  if (!apiKey) {
    return NextResponse.json({
      isLive: false,
      message: "YouTube API key not configured",
    });
  }

  try {
    // Search for live streams from the channel
    // Note: Using channelId=@hisdayspring for handle-based search
    const searchUrl = `${YOUTUBE_API_BASE}/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&eventType=live&type=video`;

    const response = await fetch(searchUrl, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`YouTube API error: ${response.status}`);
      return NextResponse.json({
        isLive: false,
        message: `YouTube API error: ${response.status}`,
      });
    }

    const data: YouTubeSearchResponse = await response.json();

    // Check if there's a live stream
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        isLive: false,
        message: "No live stream found",
      });
    }

    const liveVideo = data.items[0];

    // Get additional stats for the live video
    let viewerCount: number | undefined;
    let chatId: string | undefined;

    try {
      const videoUrl = `${YOUTUBE_API_BASE}/videos?key=${apiKey}&id=${liveVideo.id.videoId}&part=liveStreamingDetails,statistics`;
      const videoResponse = await fetch(videoUrl, { next: { revalidate: 30 } });

      if (videoResponse.ok) {
        const videoData: YouTubeVideoResponse = await videoResponse.json();
        if (videoData.items && videoData.items.length > 0) {
          const liveDetails = videoData.items[0].liveStreamingDetails;
          if (liveDetails) {
            viewerCount = liveDetails.concurrentViewers
              ? parseInt(liveDetails.concurrentViewers, 10)
              : undefined;
            chatId = liveDetails.activeLiveChatId;
          }
        }
      }
    } catch {
      // Continue without detailed stats
    }

    return NextResponse.json({
      isLive: true,
      videoId: liveVideo.id.videoId,
      title: liveVideo.snippet.title,
      description: liveVideo.snippet.description,
      thumbnailUrl:
        liveVideo.snippet.thumbnails.high?.url ||
        liveVideo.snippet.thumbnails.medium?.url,
      viewerCount,
      chatId,
      startedAt: liveVideo.snippet.publishedAt,
    });
  } catch (error) {
    console.error("Error fetching live stream status:", error);
    return NextResponse.json({
      isLive: false,
      message: "Error fetching live stream status",
    });
  }
}
