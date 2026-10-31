/**
 * Server-side YouTube live-status lookup.
 *
 * The route handler used to own the whole integration: two upstream fetches,
 * response shaping and error handling. Keeping the API conversation here means
 * the route is only responsible for HTTP status codes, and the upstream failure
 * case can be distinguished from "the channel is offline".
 */

import type { LiveStreamStatus } from "@/types";
import { YOUTUBE_API_BASE, YOUTUBE_CHANNEL_HANDLE } from "./youtube-config";

export interface LiveStreamDetails extends LiveStreamStatus {
  description?: string;
  thumbnailUrl?: string;
  viewerCount?: number;
  chatId?: string;
  startedAt?: string;
}

export type LiveStreamLookup =
  | { ok: true; isLive: false; reason: "not-configured" | "offline" }
  | { ok: true; isLive: true; stream: LiveStreamDetails }
  | { ok: false; reason: "upstream-error"; status?: number };

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
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
  kind: string;
}

interface YouTubeVideoResponse {
  items?: {
    statistics?: {
      viewCount: string;
      concurrentViewers?: string;
    };
    liveStreamingDetails?: {
      concurrentViewers?: string;
      activeLiveChatId?: string;
    };
  }[];
}

export async function fetchChannelLiveStream(options: {
  apiKey?: string;
  channelId?: string;
}): Promise<LiveStreamLookup> {
  const { apiKey, channelId = YOUTUBE_CHANNEL_HANDLE } = options;

  if (!apiKey) {
    return { ok: true, isLive: false, reason: "not-configured" };
  }

  try {
    // Search for live streams from the channel.
    // Note: channelId=@hisdayspring is the handle-based form this site has
    // always used; changing it needs the numeric UC… channel id.
    const searchUrl = `${YOUTUBE_API_BASE}/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&eventType=live&type=video`;
    const response = await fetch(searchUrl, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return { ok: false, reason: "upstream-error", status: response.status };
    }

    const data = (await response.json()) as YouTubeSearchResponse;
    const liveVideo = data.items?.[0];

    if (!liveVideo) {
      return { ok: true, isLive: false, reason: "offline" };
    }

    let viewerCount: number | undefined;
    let chatId: string | undefined;

    try {
      const videoUrl = `${YOUTUBE_API_BASE}/videos?key=${apiKey}&id=${liveVideo.id.videoId}&part=liveStreamingDetails,statistics`;
      const videoResponse = await fetch(videoUrl, {
        next: { revalidate: 30 },
      });

      if (videoResponse.ok) {
        const videoData = (await videoResponse.json()) as YouTubeVideoResponse;
        const liveDetails = videoData.items?.[0]?.liveStreamingDetails;
        if (liveDetails) {
          viewerCount = liveDetails.concurrentViewers
            ? parseInt(liveDetails.concurrentViewers, 10)
            : undefined;
          chatId = liveDetails.activeLiveChatId;
        }
      }
    } catch {
      // Viewer count and chat id are optional; the stream still goes live.
    }

    return {
      ok: true,
      isLive: true,
      stream: {
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
      },
    };
  } catch {
    return { ok: false, reason: "upstream-error" };
  }
}
