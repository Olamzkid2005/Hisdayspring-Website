/**
 * Recent uploads from the church's YouTube channel.
 *
 * Read from the public feed on the server: no API key, and the page cannot be
 * blocked by CORS the way a browser-side feed read would be. The response is
 * cached for fifteen minutes, so the list stays current on its own without a
 * redeploy.
 */

import { NextResponse } from "next/server";
import {
  FEED_REVALIDATE_SECONDS,
  fetchChannelVideos,
} from "@/lib/api/youtube-feed";

// Next reads segment config statically, so this has to be a literal rather than
// the shared constant. The test asserts the two stay equal.
export const revalidate = 900;

const MAX_RESULTS = 6;

export async function GET() {
  try {
    const videos = await fetchChannelVideos(MAX_RESULTS);
    return NextResponse.json({ videos, source: "feed" });
  } catch (error) {
    console.error("YouTube feed lookup failed", error);
    // A failure must not be cached: Next would otherwise let the edge hold this
    // 502 for the full revalidate window and hide a feed that recovered a
    // minute later.
    return NextResponse.json(
      { videos: [], message: "Could not read the YouTube channel feed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
