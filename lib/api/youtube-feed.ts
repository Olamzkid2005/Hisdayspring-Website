/**
 * Channel videos from YouTube's public RSS feed.
 *
 * The Data API needs a key, and without one this site silently served a
 * hardcoded list that was months out of date. The feed at
 * `feeds/videos.xml?channel_id=...` needs no key, returns the newest fifteen
 * uploads with titles, dates, descriptions and view counts, and is refreshed
 * by YouTube within minutes of a video going up.
 *
 * What the feed does not carry is duration. The card treats that as optional,
 * so a sermon without one simply omits the badge.
 */

import type { YouTubeVideo } from "@/types";
import { YOUTUBE_CHANNEL_ID } from "./youtube-config";

export const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

/** How stale the feed may be before the route fetches it again. */
export const FEED_REVALIDATE_SECONDS = 900;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  "#39": "'",
  "#x27": "'",
  nbsp: " ",
};

function decodeXml(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&([a-z]+|#\d+);/gi, (match, name: string) => ENTITIES[name] ?? match);
}

function tag(entry: string, name: string): string | null {
  const match = entry.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? decodeXml(match[1]).trim() : null;
}

function attribute(entry: string, name: string, attr: string): string | null {
  const match = entry.match(new RegExp(`<${name}[^>]*?${attr}="([^"]*)"`));
  return match ? decodeXml(match[1]) : null;
}

/**
 * Pick the highest-quality thumbnail YouTube keeps for a video. `hqdefault`
 * exists for every uploaded video, unlike the larger sizes.
 */
function thumbnailFor(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Turn the channel feed into video records, newest first. Pure, so the parser
 * can be tested against a saved feed without touching the network.
 */
export function parseChannelFeed(xml: string, maxResults = 6): YouTubeVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  const videos: YouTubeVideo[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    const videoId = tag(entry, "yt:videoId");
    if (!videoId || seen.has(videoId)) continue;
    seen.add(videoId);

    const title = tag(entry, "title");
    const publishedAt = tag(entry, "published");
    if (!title || !publishedAt) continue;

    videos.push({
      id: videoId,
      videoId,
      title,
      description: tag(entry, "media:description") ?? "",
      thumbnailUrl: thumbnailFor(videoId),
      publishedAt,
      viewCount: attribute(entry, "media:statistics", "views") ?? undefined,
    });
  }

  videos.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return videos.slice(0, maxResults);
}

/**
 * Read the channel feed. Throws on a non-200 so the route can answer 502
 * rather than lying with an empty list. Cached for fifteen minutes, which is
 * frequent enough for a sermon published on a Sunday evening to appear while
 * the day is still Sunday.
 */
export async function fetchChannelVideos(
  maxResults = 6
): Promise<YouTubeVideo[]> {
  const response = await fetch(YOUTUBE_FEED_URL, {
    headers: { Accept: "application/xml, text/xml" },
    next: { revalidate: FEED_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`YouTube feed responded ${response.status}`);
  }

  const videos = parseChannelFeed(await response.text(), maxResults);
  if (videos.length === 0) {
    throw new Error("YouTube feed contained no playable entries");
  }

  return videos;
}
