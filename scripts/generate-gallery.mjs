/**
 * Generate gallery data from the /public/images/gallery/ directory.
 * Run: node scripts/generate-gallery.mjs
 */

import { readdirSync, writeFileSync, statSync } from "fs";
import { join } from "path";
import { cwd } from "process";

const galleryDir = join(cwd(), "public/images/gallery");

const files = readdirSync(galleryDir)
  .filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
  .sort((a, b) => {
    // Try numeric sort for DSC files
    const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
    return numA - numB;
  });

const entries = files
  .map((file, i) => {
    const isDSC = /^DSC_?\d+/i.test(file);
    const isMG = /^_MG_/.test(file);
    const isU3A = /^_U3A/.test(file);
    const isIMG = /^IMG-/.test(file);

    // Guess category from naming patterns
    let category = "sunday-services";
    if (isU3A) category = "special-events";
    else if (isMG) category = "special-events";
    else if (isIMG) category = "youth-events";
    else if (isDSC && file.includes("507")) category = "prayer-wall";
    else if (isDSC && (file.includes("84") || file.includes("85"))) category = "special-events";

    // Use file name without extension as caption hint
    const caption = file.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();

    return `  {
    id: "gallery-${i + 1}",
    imageUrl: "/images/gallery/${file}",
    caption: "${caption}",
    category: "${category}" as GalleryCategory,
    eventName: "${getEventName(category)}",
    date: "2026-01-01",
  }`;
  })
  .join(",\n");

function getEventName(cat) {
  const names = {
    "sunday-services": "Sunday Service",
    "youth-events": "Youth Event",
    "women-program": "Women's Program",
    "special-events": "Special Event",
    "prayer-wall": "Prayer Meeting",
  };
  return names[cat] || "Church Event";
}

const output = `/**
 * Gallery photos - auto-generated from /public/images/gallery/
 * Generated: ${new Date().toISOString()}
 */

import type { GalleryPhoto, GalleryCategory } from "@/types";

export const galleryPhotos: GalleryPhoto[] = [
${entries},
];

export const getPhotosByCategory = (category: GalleryCategory) => {
  return galleryPhotos.filter((photo) => photo.category === category);
};

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "sunday-services", label: "Sunday Services" },
  { value: "youth-events", label: "Youth Events" },
  { value: "women-program", label: "Women's Program" },
  { value: "special-events", label: "Special Events" },
  { value: "prayer-wall", label: "Prayer Wall" },
];
`;

writeFileSync(join(cwd(), "data/gallery.ts"), output, "utf-8");
console.log(`Generated ${files.length} gallery entries → data/gallery.ts`);
