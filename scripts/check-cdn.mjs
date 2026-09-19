/**
 * Verify the Cloudinary CDN actually serves every image the code references.
 *
 * - Extracts all /images/... references from app/ components/ data/ lib/ types/
 * - Builds the delivery URL exactly like lib/cdn/cloudinary-loader.ts does
 * - HEAD-checks each URL (f_auto,q_auto,c_limit,w_640) and reports failures
 *
 * Needs no API secret — uses public delivery URLs.
 * Run: node scripts/check-cdn.mjs
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "hurqcssn";
const CHECK_WIDTH = 640;
const CONCURRENCY = 12;
const SOURCE_DIRS = ["app", "components", "data", "lib", "types"];
const REF_RE = /\/images\/[A-Za-z0-9 _./()-]*/g;

function walk(dir, out = []) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = SOURCE_DIRS.flatMap((d) => walk(join(ROOT, d))).filter((f) => /\.(ts|tsx)$/.test(f));

const refs = new Set();
let templateRefs = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(REF_RE)) {
    const cleaned = match[0].replace(/[.,)'"\s]+$/, "");
    if (!cleaned || cleaned === "/images") continue;
    // Directory prefixes like /images/gallery/ are template bases — count, don't fetch
    if (cleaned.endsWith("/")) {
      templateRefs++;
      continue;
    }
    refs.add(cleaned);
  }
}

console.log(`Found ${refs.size} concrete image references (${templateRefs} template prefixes skipped)`);

function toCdnUrl(localPath, width) {
  const publicId = localPath
    .replace(/^\/?images\//, "")
    .replace(/\.[a-zA-Z0-9]+$/, "")
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}`;
}

let ok = 0;
const broken = [];
let cursor = 0;
const all = [...refs];

async function checkOne(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const type = res.headers.get("content-type") || "";
    if (res.ok && type.startsWith("image/")) ok++;
    else broken.push({ url, status: res.status, type });
  } catch (e) {
    broken.push({ url, status: "network-error", type: e.message });
  }
}

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < all.length) {
      const localPath = all[cursor++];
      await checkOne(toCdnUrl(localPath, CHECK_WIDTH));
      if ((ok + broken.length) % 100 === 0) console.log(`  checked ${ok + broken.length}/${all.length}…`);
    }
  }),
);

console.log(`\n✓ OK: ${ok}   ✗ Broken: ${broken.length}`);
for (const b of broken.slice(0, 25)) console.log(`  [${b.status}] ${b.url}`);
if (broken.length > 25) console.log(`  … and ${broken.length - 25} more`);

if (broken.length > 0) process.exit(2);
console.log("\nAll referenced images are live on the CDN ✓");
