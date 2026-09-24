/**
 * Single source of truth for the Cloudinary cloud name.
 *
 * The cloud name is public information (it appears in every delivery URL), so
 * a hardcoded default keeps fresh clones working even if the env var is
 * forgotten. NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME overrides when set.
 */

const DEFAULT_CLOUD_NAME = "hurqcssn";

export function getCloudinaryCloudName(): string {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
}
