/**
 * Deletes the PNG/JPG screenshots that already have a .webp next to them.
 *
 * Run this only after checking the site looks right — it removes the heavy
 * originals (~130 MB) that nothing serves any more. Pass --dry to preview.
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "portfolio");
const SOURCE_RE = /\.(png|jpe?g)$/i;
const dry = process.argv.includes("--dry");

const walk = async (dir) => {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (SOURCE_RE.test(entry.name)) out.push(full);
  }
  return out;
};

let freed = 0;
let count = 0;

for (const file of await walk(ROOT)) {
  const webp = file.replace(SOURCE_RE, ".webp");
  try {
    await fs.access(webp);
  } catch {
    console.log(`  keep (no webp): ${path.relative(ROOT, file)}`);
    continue;
  }
  freed += (await fs.stat(file)).size;
  count++;
  if (!dry) await fs.unlink(file);
}

console.log(
  `${dry ? "Would delete" : "Deleted"} ${count} originals, freeing ${Math.round(
    freed / 1024 / 1024
  )} MB.`
);
