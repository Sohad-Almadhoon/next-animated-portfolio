import fs from "fs";
import path from "path";
import sharp from "sharp";

export type Project = {
  slug: string;
  title: string;
  accent: string;
  role: string;
  year: string;
  tagline: string;
  stack: string[];
  live?: string;
  code?: string;
  /** File inside the project folder that opens the slider (defaults to the first). */
  coverShot?: string;
  /** Used only when public/portfolio/<slug>/ is empty. */
  cover: string;
};

export type Shot = {
  src: string;
  width: number;
  height: number;
};

export type ProjectWithShots = Project & {
  /** Screenshots read from public/portfolio/<slug>/, natural-sorted. */
  shots: Shot[];
  /** Index of coverShot within shots. */
  coverIndex: number;
  host: string;
};

export const projects: Project[] = [
  {
    slug: "carepulse",
    title: "CarePulse",
    accent: "#4FBFA8",
    role: "Full-stack",
    year: "2024",
    tagline:
      "Healthcare booking platform — patients request appointments, staff approve or reschedule them from an admin dashboard.",
    stack: ["Next.js", "TypeScript", "Appwrite", "Tailwind"],
    live: "https://carepulse-blue-two.vercel.app/",
    coverShot: "03.png",
    cover: "/portfolio/01.webp",
  },
  {
    slug: "podcasty",
    title: "Podcasty",
    accent: "#9C86D9",
    role: "Full-stack",
    year: "2025",
    tagline:
      "AI podcast platform — describe an episode and it generates the audio and cover art, with Google sign-in and search.",
    stack: ["Next.js 15", "Supabase", "OpenAI", "Tailwind"],
    live: "https://podcasty-v2.vercel.app/",
    coverShot: "04.png",
    cover: "/portfolio/02.webp",
  },
  {
    slug: "loomai",
    title: "Loomi.ai",
    accent: "#7FA98C",
    role: "Full-stack",
    year: "2025",
    tagline:
      "Generates optimized product listings for shop owners in minutes — sign up, describe the item, publish.",
    stack: ["Next.js", "TypeScript", "AI", "Tailwind"],
    live: "https://loom-ai-web.vercel.app/",
    coverShot: "06.png",
    cover: "/portfolio/03.webp",
  },
  {
    slug: "car4sales",
    title: "Car4Sales",
    accent: "#7C93F5",
    role: "Backend",
    year: "2024",
    tagline:
      "Car marketplace: OTP auth, seller profiles with listings and sales charts, location search, Stripe checkout.",
    stack: ["Node.js", "Express", "MongoDB", "Stripe", "JWT"],
    code: "https://github.com/Sohad-Almadhoon/backend_grad",
    cover: "/portfolio/04.webp",
  },
  {
    slug: "fiverr",
    title: "Fiverr Clone",
    accent: "#E2708F",
    role: "Full-stack",
    year: "2024",
    tagline:
      "Freelance marketplace: gig browsing, orders, buyer-seller messaging and secure payments.",
    stack: ["React", "Express", "Mongoose", "Stripe"],
    live: "https://fiverr-client-1.vercel.app/",
    coverShot: "09.png",
    cover: "/portfolio/05.webp",
  },
  {
    slug: "bookshop",
    title: "Book Platform",
    accent: "#D9A441",
    role: "Full-stack",
    year: "2025",
    tagline:
      "Readers create, follow and discuss books chapter by chapter behind a one-time $5 access fee.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    live: "https://bookshop-frontend-gold.vercel.app/",
    coverShot: "11.png",
    cover: "/portfolio/06.webp",
  },
];

const IMAGE_RE = /\.(png|jpe?g|webp|avif|gif)$/i;

/** Natural sort so 2.png comes before 10.png (and 01.png before 02.png). */
const naturalSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const readShots = (slug: string): string[] => {
  const dir = path.join(process.cwd(), "public", "portfolio", slug);
  try {
    const files = fs.readdirSync(dir).filter((f) => IMAGE_RE.test(f));

    // scripts/optimize-images.mjs writes a .webp next to every export; serve
    // that and ignore the multi-megabyte original of the same name.
    const best = new Map<string, string>();
    for (const file of files) {
      const stem = file.replace(/\.[^.]+$/, "");
      const current = best.get(stem);
      if (!current || (!current.endsWith(".webp") && file.endsWith(".webp"))) {
        best.set(stem, file);
      }
    }

    return Array.from(best.values())
      .sort(naturalSort)
      .map((f) => `/portfolio/${slug}/${f}`);
  } catch {
    return [];
  }
};

/**
 * Real pixel dimensions, so images can be laid out intrinsically instead of
 * with `fill`. `fill` collapses to zero height whenever an ancestor sizes
 * itself from flex or a percentage, which is what blanked the enlarged view.
 */
const measure = async (src: string): Promise<Shot> => {
  try {
    const { width, height } = await sharp(
      path.join(process.cwd(), "public", src.replace(/^\//, ""))
    ).metadata();
    if (width && height) return { src, width, height };
  } catch {
    /* unreadable — fall back to a sane 3:2 */
  }
  return { src, width: 1600, height: 1067 };
};

const hostOf = (project: Project) => {
  const url = project.live ?? project.code;
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export const getProjects = async (): Promise<ProjectWithShots[]> =>
  Promise.all(
    projects.map(async (project) => {
      const found = readShots(project.slug);
      const shots = await Promise.all(
        (found.length ? found : [project.cover]).map(measure)
      );
      // coverShot is written as "03.png" but the file served is "03.webp",
      // so match on the stem rather than the full filename.
      const stem = project.coverShot?.replace(/\.[^.]+$/, "");
      const coverIndex = stem
        ? Math.max(
            0,
            shots.findIndex((s) =>
              s.src.split("/").pop()?.startsWith(stem + ".")
            )
          )
        : 0;

      return { ...project, shots, coverIndex, host: hostOf(project) };
    })
  );
