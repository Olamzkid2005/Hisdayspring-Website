/** Shared YouTube constants (no secrets live here). */
export const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * The church's channel. Verified 2026-11-01: youtube.com/@Dayspring_Family
 * resolves to "Hisdayspring Evangelical Ministries International"; the old
 * @hisdayspring handle returns 404.
 */
export const YOUTUBE_CHANNEL_HANDLE = "@Dayspring_Family";

export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`;

/**
 * Numeric channel id the Data API requires — `channelId` does not accept a
 * handle. Taken from the channel page's `externalId`.
 */
export const YOUTUBE_CHANNEL_ID = "UCsK_cum0IKbuQ75Va8ty0CA";
