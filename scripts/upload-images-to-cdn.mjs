/**
 * Upload public/images to Cloudinary with HIGH-RES PREFERENCE.
 *
 * - public_id mirrors the repo path under /images minus the extension, which
 *   is exactly what lib/cdn/cloudinary-loader.ts expects:
 *     public/images/gallery/DSC01524.jpg → gallery/DSC01524
 * - For every repo image, if a same-named camera original exists in
 *   ORIGINALS_DIR (default ~/Downloads/FOR WEBSITE), the ORIGINAL is
 *   uploaded — Cloudinary f_auto/q_auto then serves right-sized variants,
 *   so originals give the best quality at no bandwidth cost.
 * - Resumable: uploaded public_ids are recorded in .cdn-uploads.json and
 *   skipped on re-run. Use --force to re-upload everything.
 *
 * Setup (in .env.local):
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 *   CLOUDINARY_CLOUD_NAME=hurqcssn   (optional, defaults to hurqcssn)
 *
 * Run: node scripts/upload-images-to-cdn.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { basename, join, relative } from "path";
import { homedir } from "os";

const ROOT = process.cwd();
const IMAGES_DIR = join(ROOT, "public/images");
const ORIGINALS_DIR = process.env.ORIGINALS_DIR || join(homedir(), "Downloads", "FOR WEBSITE");
const MANIFEST_PATH = join(ROOT, ".cdn-uploads.json");
const CONCURRENCY = Number(process.env.UPLOAD_CONCURRENCY || 5);
const MAX_ATTEMPTS = 4;
const FORCE = process.argv.includes("--force");
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

// ---------- env (parse .env.local manually; no extra deps) ----------
function loadEnvFile() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadEnvFile();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "hurqcssn";
const { CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;

if (!apiKey || !apiSecret) {
  console.error(
    "✗ Missing credentials. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local",
  );
  process.exit(1);
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

// ---------- walk repo images ----------
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (!existsSync(IMAGES_DIR)) {
  console.error("✗ public/images not found — nothing to upload.");
  process.exit(1);
}

const repoFiles = walk(IMAGES_DIR).filter((f) => IMAGE_EXT.test(f));

// ---------- index camera originals by lowercase basename ----------
const originals = new Map();
if (existsSync(ORIGINALS_DIR)) {
  for (const f of walk(ORIGINALS_DIR)) {
    if (!IMAGE_EXT.test(f)) continue;
    const key = basename(f).toLowerCase();
    // keep the largest file when names collide
    if (!originals.has(key)) originals.set(key, f);
  }
  console.log(`Indexed ${originals.size} high-res originals from ${ORIGINALS_DIR}`);
} else {
  console.log(`⚠ ORIGINALS_DIR not found (${ORIGINALS_DIR}) — uploading repo copies only`);
}

// ---------- build job list ----------
let manifest = existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) : {};

const jobs = [];
for (const repoFile of repoFiles) {
  const rel = relative(IMAGES_DIR, repoFile); // e.g. "gallery/DSC01524.jpg"
  const publicId = rel.replace(/\.[^.]+$/, ""); // "gallery/DSC01524"
  if (!FORCE && manifest[publicId]) continue;
  const original = originals.get(basename(repoFile).toLowerCase()) || repoFile;
  jobs.push({ repoFile, uploadFrom: original, publicId, highRes: original !== repoFile });
}

const alreadyDone = repoFiles.length - jobs.length;
console.log(
  `Repo images: ${repoFiles.length} | already uploaded: ${alreadyDone} | to upload: ${jobs.length} ` +
    `(high-res originals: ${jobs.filter((j) => j.highRes).length})`,
);

if (jobs.length === 0) {
  console.log("Nothing to do ✓");
  process.exit(0);
}

// ---------- pool with retry ----------
let done = 0;
let failed = 0;
const failures = [];
let saveCounter = 0;

function saveManifest() {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function uploadOne(job) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await cloudinary.uploader.upload(job.uploadFrom, {
        public_id: job.publicId,
        resource_type: "image",
        overwrite: false,
      });
      manifest[job.publicId] = {
        source: job.highRes ? "original" : "repo",
        at: new Date().toISOString(),
      };
      done++;
      if (done % 25 === 0 || done === jobs.length) {
        saveManifest();
        console.log(`  ${done}/${jobs.length} uploaded…`);
      }
      return;
    } catch (err) {
      const fatal = err?.http_code === 401 || err?.http_code === 404;
      if (fatal || attempt === MAX_ATTEMPTS) {
        failed++;
        failures.push({ publicId: job.publicId, error: err?.message || String(err) });
        return;
      }
      await new Promise((r) => setTimeout(r, 1000 * 2 ** (attempt - 1)));
    }
  }
}

async function runPool() {
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      await uploadOne(job);
    }
  });
  await Promise.all(workers);
}

console.time("upload");
await runPool();
saveManifest();
console.timeEnd("upload");

console.log(`\n✓ Uploaded: ${done}  ✗ Failed: ${failed}`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures.slice(0, 20)) console.log(`  - ${f.publicId}: ${f.error}`);
  if (failures.length > 20) console.log(`  … and ${failures.length - 20} more`);
  process.exit(2);
}
