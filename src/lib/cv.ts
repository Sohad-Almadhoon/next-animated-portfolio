import fs from "fs";
import path from "path";

const CV_RE = /^(cv|resume).*\.pdf$/i;
const PUBLIC = path.join(process.cwd(), "public");

const findIn = (dir: string): string | null => {
  try {
    const file = fs.readdirSync(dir).filter((f) => CV_RE.test(f)).sort()[0];
    if (!file) return null;
    const rel = path.relative(PUBLIC, path.join(dir, file)).split(path.sep);
    return "/" + rel.map(encodeURIComponent).join("/");
  } catch {
    return null;
  }
};

/**
 * Finds the CV anywhere in /public (root first, then one level down), so
 * dropping the file in is all that's needed — no code change, and it does
 * not matter whether it lands in public/ or public/portfolio/.
 * Any name starting with "cv" or "resume" works: CV.pdf, cv-2025.pdf, …
 */
export const getCvHref = (): string | null => {
  const atRoot = findIn(PUBLIC);
  if (atRoot) return atRoot;

  try {
    for (const entry of fs.readdirSync(PUBLIC, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const found = findIn(path.join(PUBLIC, entry.name));
      if (found) return found;
    }
  } catch {
    /* public/ unreadable — fall through */
  }
  return null;
};
