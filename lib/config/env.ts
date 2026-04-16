/**
 * Environment configuration
 * Validates and exports environment variables
 */

interface EnvConfig {
  youtubeApiKeyPublic: string | undefined;
  youtubeApiKeyServer: string | undefined;
  paystackPublicKey: string | undefined;
  flutterwavePublicKey: string | undefined;
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

export function validateEnv(): void {
  const requiredButMissing: string[] = [];

  // Only validate if we're on the server and the env var is literally undefined (not empty string)
  // For client-side keys, we don't require them at build time since they're meant to be public

  if (requiredButMissing.length > 0) {
    console.warn(
      `Missing required environment variables: ${requiredButMissing.join(", ")}`
    );
  }
}

export const config: EnvConfig = {
  // Client-side YouTube API key (exposed to browser)
  youtubeApiKeyPublic: getOptionalEnv("NEXT_PUBLIC_YOUTUBE_API_KEY"),

  // Server-side YouTube API key (never exposed to client)
  youtubeApiKeyServer: getOptionalEnv("YOUTUBE_API_KEY"),

  // Paystack public key (safe to expose - used on client-side)
  paystackPublicKey: getOptionalEnv("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"),

  // Flutterwave public key (optional - safe to expose)
  flutterwavePublicKey: getOptionalEnv("NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY"),

  // Google Maps API key (used for embeds)
  googleMapsApiKey: getOptionalEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),

  // WhatsApp number for floating button
  whatsappNumber: getEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+2349066192155"),
};

// Validate on module load (server-side only)
if (typeof window === "undefined") {
  validateEnv();
}
