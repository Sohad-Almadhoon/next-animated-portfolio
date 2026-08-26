"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import Lightbox from "./lightbox";
import ProjectPanel from "./projectPanel";
import type { ProjectWithShots } from "@/lib/portfolio";

const PortfolioClient = ({ projects }: { projects: ProjectWithShots[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [gallery, setGallery] = useState<{
    project: number;
    shot: number;
  } | null>(null);

  const { scrollYProgress } = useScroll({ target: ref });
  // End exactly on the last panel instead of the hard-coded -80%.
  const end = `-${((projects.length - 1) / projects.length) * 100}%`;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", end]);
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const active = gallery !== null ? projects[gallery.project] : null;
  const totalShots = projects.reduce((sum, p) => sum + p.shots.length, 0);

  return (
    <motion.div
      className="bg-[#0b0b0e]"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}>
      {/* ---------- intro ---------- */}
      <div className="grain relative flex h-[calc(100vh-6rem)] flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center text-white">
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-[0.3]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C93F5] opacity-[0.13] blur-[140px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_50%,transparent_25%,#0b0b0e_95%)]" />

        <p className="relative font-mono text-[10px] uppercase tracking-[0.35em] text-white/40 md:text-xs">
          Selected work &middot; {projects.length} projects
        </p>
        <h1 className="relative text-5xl font-semibold tracking-[-0.04em] sm:text-6xl md:text-8xl">
          My Works
        </h1>
        <p className="relative max-w-md text-sm leading-relaxed text-white/50 md:text-[15px]">
          Every project ships with a full screenshot gallery &mdash;{" "}
          <span className="text-white/80">{totalShots} screens in total</span>.
          No need to open anything live: click a screen to page through it right
          here.
        </p>

        {/* index of what is coming up in the reel */}
        <ul className="relative mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 md:text-[11px]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: project.accent }}
              />
              {project.title}
            </li>
          ))}
        </ul>

        <div className="relative mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          <span>Scroll</span>
          <motion.span
            animate={{ x: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-base text-white/60">
            &#8594;
          </motion.span>
        </div>
      </div>

      {/* ---------- horizontal reel ---------- */}
      <div
        className="relative"
        style={{ height: `${(projects.length + 1) * 100}vh` }}
        ref={ref}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x }} className="flex">
            {projects.map((project, i) => (
              <ProjectPanel
                key={project.slug}
                project={project}
                index={i}
                total={projects.length}
                eager={i === 0}
                onOpen={(shot) => setGallery({ project: i, shot })}
              />
            ))}
          </motion.div>

          {/* scroll progress */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10">
            <motion.div
              style={{ scaleX: progress }}
              className="h-full origin-left bg-white/70"
            />
          </div>
        </div>
      </div>

      <Lightbox
        open={gallery !== null}
        shots={active?.shots ?? []}
        index={gallery?.shot ?? 0}
        title={active?.title ?? ""}
        accent={active?.accent ?? "#ffffff"}
        onIndexChange={(shot) => setGallery((g) => (g ? { ...g, shot } : g))}
        onClose={() => setGallery(null)}
      />

      {/* ---------- outro ---------- */}
      <div className="grain relative flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden px-6 text-center text-white md:gap-12">
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-[0.3]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[60vh] w-[70vw] -translate-x-1/2 translate-y-1/3 rounded-full bg-[#7C93F5] opacity-[0.14] blur-[140px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_60%,transparent_25%,#0b0b0e_95%)]" />
        <h2 className="relative text-4xl font-semibold tracking-tight md:text-7xl">
          Do you have a project?
        </h2>
        <div className="relative">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 12, ease: "linear", repeat: Infinity }}
            viewBox="0 0 300 300"
            className="h-64 w-64 md:h-[440px] md:w-[440px]">
            <defs>
              <path
                id="circlePath"
                d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "
              />
            </defs>
            <text fill="rgba(255,255,255,0.55)">
              <textPath
                xlinkHref="#circlePath"
                className="font-mono text-[13px] uppercase tracking-[0.2em]">
                Full stack developer &middot; MERN &middot; Available for work
                &middot;
              </textPath>
            </text>
          </motion.svg>
          <Link
            href="/contact"
            className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition hover:scale-105 md:h-28 md:w-28 md:text-base">
            Hire Me
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioClient;
