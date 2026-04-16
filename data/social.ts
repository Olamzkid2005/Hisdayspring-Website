/**
 * Social media links data
 * Real content from research
 */

import type { SocialLink } from "@/types";

export const socialLinks: SocialLink[] = [
  {
    platform: "facebook",
    url: "https://www.facebook.com/people/Hisdayspring-Evangelical-Ministries-Intl-Dayspring/61563639119953/",
    label: "Hisdayspring Church",
  },
  {
    platform: "youtube",
    url: "https://www.youtube.com/@hisdayspring",
    label: "Hisdayspring Ministries",
  },
  {
    platform: "instagram",
    url: "https://www.instagram.com/hisdayspring_family/",
    label: "@hisdayspring_family",
  },
  {
    platform: "instagram",
    url: "https://www.instagram.com/hisdayspring",
    label: "@hisdayspring (Radio)",
  },
  {
    platform: "twitter",
    url: "https://twitter.com/hisdayspringNG",
    label: "@hisdayspringNG",
  },
  {
    platform: "zenofm",
    url: "https://zeno.fm/radio/hisdayspringradio/",
    label: "Hisdayspring Radio",
  },
];

export const getSocialLinkByPlatform = (platform: SocialLink["platform"]) => {
  return socialLinks.filter((link) => link.platform === platform);
};
