/**
 * Converts every screenshot in public/portfolio/<slug>/ to WebP.
 *
 * The raw PNG exports are ~1.5 MB each (130 MB total), which is why the
 * galleries took seconds to appear. WebP at 1600px wide is visually identical
 * here and roughly 10x smaller.
 *
 * Originals are left in place; the site prefers the .webp automatically.
 * Delete them once you are happy:  npm run images:clean
 *
 * Usage: node scripts/optimize-images.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "portfolio");
const MAX_WIDTH = 1600;
const QUALITY = 82;
const SOURCE_RE = /\.(png|jpe?g)$/i;

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const convert = async (file) => {
  const out = file.replace(SOURCE_RE, ".webp");

  try {
    // Skip work that's already done.
    const [src, dest] = await Promise.all([fs.stat(file), fs.stat(out)]);
    if (dest.mtimeMs >= src.mtimeMs) return { skipped: true, before: 0, after: 0 };
  } catch {
    /* no webp yet — convert */
  }

  const before = (await fs.stat(file)).size;
  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  const after = (await fs.stat(out)).size;

  console.log(
    `  ${path.relative(ROOT, file)}  ${kb(before)} -> ${kb(after)}`
  );
  return { skipped: false, before, after };
};

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (SOURCE_RE.test(entry.name)) files.push(full);
  }
  return files;
};

const files = await walk(ROOT);
console.log(`Converting ${files.length} screenshots...`);

let before = 0;
let after = 0;
let skipped = 0;

for (const file of files) {
  const result = await convert(file);
  if (result.skipped) skipped++;
  before += result.before;
  after += result.after;
}

console.log(
  `\nDone. ${files.length - skipped} converted, ${skipped} already current.`
);
if (before) {
  console.log(
    `${kb(before)} -> ${kb(after)} (${Math.round((1 - after / before) * 100)}% smaller)`
  );
}
