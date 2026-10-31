/**
 * YouTube live stream status.
 *
 * The API conversation lives in `lib/api/youtube-live.ts`. An upstream failure
 * now returns 502 instead of a 200 with `isLive: false`, so callers can tell
 * "the channel is offline" apart from "the check failed".
 */

import { NextResponse } from "next/server";
import { fetchChannelLiveStream } from "@/lib/api/youtube-live";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const result = await fetchChannelLiveStream({
    apiKey: process.env.YOUTUBE_API_KEY,
    channelId: process.env.YOUTUBE_CHANNEL_ID,
  });

  if (!result.ok) {
    console.error(
      "YouTube live status lookup failed",
      result.status ? `(HTTP ${result.status})` : ""
    );
    return NextResponse.json(
      { isLive: false, message: "Error fetching live stream status" },
      { status: 502 }
    );
  }

  if (!result.isLive) {
    return NextResponse.json({
      isLive: false,
      message:
        result.reason === "not-configured"
          ? "YouTube API key not configured"
          : "No live stream found",
    });
  }

  return NextResponse.json(result.stream);
}
