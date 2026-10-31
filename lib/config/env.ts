/**
 * Environment configuration.
 *
 * These keys are optional: the site is designed to render without any of them
 * and degrade gracefully (YouTube falls back to cached sermons, the map is
 * omitted, WhatsApp uses the church number). The previous `validateEnv()`
 * built an empty "missing" list and never actually checked anything, so it has
 * been removed rather than left as a function that implies validation.
 */

import { contactInfo } from "@/data/contact";

interface EnvConfig {
  youtubeApiKeyPublic: string | undefined;
  youtubeApiKeyServer: string | undefined;
  googleMapsApiKey: string | undefined;
  whatsappNumber: string;
}

function getEnv(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value === "" ? undefined : value;
}

export const config: EnvConfig = {
  // Client-side YouTube API key (exposed to browser)
  youtubeApiKeyPublic: getOptionalEnv("NEXT_PUBLIC_YOUTUBE_API_KEY"),

  // Server-side YouTube API key (never exposed to client)
  youtubeApiKeyServer: getOptionalEnv("YOUTUBE_API_KEY"),

  // Google Maps API key (used for embeds)
  googleMapsApiKey: getOptionalEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),

  // WhatsApp number for floating button — defaults to the church number in
  // `data/contact.ts` instead of a second hard-coded copy.
  whatsappNumber: getEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", contactInfo.whatsapp),
};
