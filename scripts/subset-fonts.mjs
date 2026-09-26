import subsetFont from "subset-font";
import fs from "node:fs";
import path from "node:path";

const DIR = "app/fonts";

// Everything the site actually renders, plus headroom for user-typed text.
// Deliberately generous on Latin: form fields accept arbitrary names and prayer
// requests in the BODY font, and Yoruba needs Latin Extended Additional
// (U+1E00-1EFF: e.g. U+1EB9 e-ogonek-below, U+1ECD o-dot-below).
let text = "";
const range = (a, b) => {
  for (let c = a; c <= b; c++) text += String.fromCodePoint(c);
};
range(0x20, 0x7e); // Basic Latin
range(0xa0, 0xff); // Latin-1 Supplement
range(0x100, 0x17f); // Latin Extended-A
range(0x180, 0x24f); // Latin Extended-B
range(0x1e00, 0x1eff); // Latin Extended Additional (Yoruba)
range(0x300, 0x36f); // combining diacritics
// Symbols the copy uses: em/en dash, bullet, middle dot, ellipsis, smart
// quotes, arrows, multiplication sign, and the Naira + currency signs.
text += "—–•·…\u201C\u201D\u2018\u2019←→×₦$€£°§¶";

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".woff2")).sort();
let before = 0;
let after = 0;

for (const f of files) {
  const p = path.join(DIR, f);
  const src = fs.readFileSync(p);
  const out = await subsetFont(src, text, { targetFormat: "woff2" });
  fs.writeFileSync(p, out);
  before += src.length;
  after += out.length;
  console.log(
    `${f.padEnd(42)} ${(src.length / 1024).toFixed(0).padStart(4)}KB -> ${(out.length / 1024).toFixed(0).padStart(3)}KB`
  );
}

console.log(
  `\ntotal: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB  (${(
    (1 - after / before) *
    100
  ).toFixed(1)}% smaller)`
);

// Verify the output is real woff2 (magic bytes 'wOF2'), not garbage.
const bad = files.filter((f) => fs.readFileSync(path.join(DIR, f)).subarray(0, 4).toString() !== "wOF2");
console.log(bad.length ? `INVALID woff2: ${bad.join(", ")}` : "all files are valid woff2 (wOF2 magic)");
