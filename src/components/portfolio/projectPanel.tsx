"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectWithShots } from "@/lib/portfolio";

const AUTOPLAY_MS = 2600;

const ExpandIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
    <path
      d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const pad = (n: number) => String(n).padStart(2, "0");

const ProjectPanel = ({
  project,
  index,
  total,
  eager,
  onOpen,
}: {
  project: ProjectWithShots;
  index: number;
  total: number;
  eager: boolean;
  onOpen: (shot: number) => void;
}) => {
  const {
    shots,
    coverIndex,
    title,
    host,
    role,
    year,
    tagline,
    stack,
    live,
    code,
    accent,
  } = project;
  const many = shots.length > 1;

  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Opens on the shot picked as the cover, then rolls on from there.
  const [slide, setSlide] = useState(coverIndex);
  const [engaged, setEngaged] = useState(false);

  // Only the panel on screen autoplays — otherwise every reel would be
  // pulling images at once.
  const inView = useInView(sectionRef, { amount: 0.5 });

  useEffect(() => {
    if (!many || !inView || engaged) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % shots.length),
      AUTOPLAY_MS
    );
    return () => clearInterval(id);
  }, [many, inView, engaged, shots.length]);

  // Keep the active thumbnail centred without ever scrolling an ancestor —
  // the page itself is scroll-driven, so a stray scroll would jump the reel.
  useEffect(() => {
    const thumb = thumbRefs.current[slide];
    const rail = railRef.current;
    if (!thumb || !rail) return;
    rail.scrollTo({
      left: thumb.offsetLeft - rail.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [slide]);

  const go = (delta: number) => {
    setEngaged(true);
    setSlide((s) => (s + delta + shots.length) % shots.length);
  };

  const num = pad(index + 1);

  return (
    <section
      ref={sectionRef}
      className="grain relative flex h-screen w-screen shrink-0 items-center overflow-hidden bg-[#0b0b0e] px-4 py-6 text-white sm:px-6 md:px-12 md:py-10 lg:px-20">
      {/* structure + light */}
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[85vh] w-[65vw] -translate-y-1/2 rounded-full opacity-[0.16] blur-[150px]"
        style={{ backgroundColor: accent }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_10%,transparent_30%,#000_100%)]" />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px opacity-40"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
        }}
      />

      {/* index watermark */}
      <span
        className="pointer-events-none absolute -bottom-[3vw] left-2 select-none font-mono text-[22vw] font-bold leading-none text-transparent opacity-[0.05] md:left-8 md:text-[15vw]"
        style={{ WebkitTextStroke: "1.5px white" }}
        aria-hidden>
        {num}
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-12">
        {/* ---------- copy ---------- */}
        <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-5 lg:gap-6">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 md:text-[11px]">
            <span style={{ color: accent }}>{num}</span>
            <span className="h-px w-8 bg-white/15" />
            <span>
              {role} &middot; {year}
            </span>
          </div>

          <h2 className="text-[2rem] font-semibold leading-[1.03] tracking-[-0.035em] sm:text-[2.5rem] md:text-6xl lg:text-[4rem]">
            {title}
          </h2>

          <p className="line-clamp-3 max-w-lg text-[13px] leading-relaxed text-white/55 sm:text-sm md:line-clamp-none md:text-[15px]">
            {tagline}
          </p>

          <ul className="flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/50">
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            {many && (
              <button
                type="button"
                onClick={() => onOpen(slide)}
                className="flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold text-[#0b0b0e] transition hover:brightness-110"
                style={{
                  backgroundColor: accent,
                  boxShadow: `0 8px 32px -12px ${accent}`,
                }}>
                <ExpandIcon className="h-4 w-4" />
                View {shots.length} screenshots
              </button>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white">
                Live site &#8599;
              </a>
            )}
            {code && (
              <a
                href={code}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white">
                Source &#8599;
              </a>
            )}
          </div>
        </div>

        {/* ---------- slider ---------- */}
        <div className="flex flex-col gap-2.5 lg:col-span-7 lg:gap-3">
          <div className="relative">
            {/* stacked sheets hinting at more screens behind the cover */}
            {many && (
              <>
                <div className="absolute inset-x-7 -top-2.5 h-5 rounded-t-xl bg-white/[0.06] ring-1 ring-white/[0.08]" />
                <div className="absolute inset-x-14 -top-5 h-5 rounded-t-xl bg-white/[0.03] ring-1 ring-white/[0.05]" />
              </>
            )}

            <motion.div
              role="button"
              tabIndex={0}
              onClick={() => onOpen(slide)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(slide);
                }
              }}
              // Autoplay stops the moment the visitor engages, so they can
              // actually study a screen instead of chasing it.
              onMouseEnter={() => setEngaged(true)}
              onMouseLeave={() => setEngaged(false)}
              aria-label={`Open ${title} gallery, ${shots.length} screenshots`}
              whileHover={{ scale: 1.012 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10 shadow-[0_45px_100px_-35px_rgba(0,0,0,1)]">
              {/* the shots are already laptop mock-ups, so they get a plain
                  mat instead of a second browser frame, and object-contain
                  keeps every composition intact whatever its ratio */}
              <div className="relative aspect-[16/10] w-full md:aspect-[3/2]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={shots[slide].src}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}>
                    <Image
                      src={shots[slide].src}
                      alt={`${title} screenshot ${slide + 1}`}
                      fill
                      sizes="(max-width: 1024px) 92vw, 760px"
                      priority={eager && slide === coverIndex}
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* hover affordance */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0b0e]/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-[#0b0b0e]"
                    style={{ backgroundColor: accent }}>
                    <ExpandIcon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                    {many ? `Browse ${shots.length} screens` : "Enlarge"}
                  </span>
                </div>

                {/* autoplay bar */}
                {many && (
                  <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                    <motion.div
                      key={`${slide}-${engaged}`}
                      className="h-full origin-left"
                      style={{ backgroundColor: accent }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: engaged ? 0 : 1 }}
                      transition={{
                        duration: AUTOPLAY_MS / 1000,
                        ease: "linear",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* slider controls */}
              {many && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(-1);
                    }}
                    aria-label="Previous screenshot"
                    className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b0b0e]/80 text-white/80 opacity-0 ring-1 ring-white/15 backdrop-blur transition hover:text-white group-hover:opacity-100">
                    <Chevron dir="left" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(1);
                    }}
                    aria-label="Next screenshot"
                    className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b0b0e]/80 text-white/80 opacity-0 ring-1 ring-white/15 backdrop-blur transition hover:text-white group-hover:opacity-100">
                    <Chevron dir="right" />
                  </button>

                  {/* live counter — always visible */}
                  <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-[#0b0b0e]/85 px-2.5 py-1 font-mono text-[10px] tabular-nums text-white/70 ring-1 ring-white/15 backdrop-blur md:text-[11px]">
                    <ExpandIcon className="h-3 w-3" />
                    <span style={{ color: accent }}>{pad(slide + 1)}</span>
                    <span className="text-white/30">/</span>
                    {pad(shots.length)}
                  </span>
                </>
              )}
            </motion.div>
          </div>

          {/* every screenshot, as a filmstrip */}
          {many && (
            <div className="flex items-center gap-3">
              <div
                ref={railRef}
                className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
                {shots.map((shot, i) => (
                  <button
                    key={shot.src}
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => {
                      setEngaged(true);
                      setSlide(i);
                    }}
                    onDoubleClick={() => onOpen(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    aria-current={i === slide}
                    className={`relative h-10 w-16 shrink-0 overflow-hidden rounded bg-black/40 transition md:h-12 md:w-20 ${
                      i === slide
                        ? "opacity-100"
                        : "opacity-45 ring-1 ring-white/15 hover:opacity-80"
                    }`}
                    style={
                      i === slide
                        ? { boxShadow: `0 0 0 1.5px ${accent}` }
                        : undefined
                    }>
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              {host && (
                <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.1em] text-white/30 xl:block">
                  {host}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* project counter */}
      <span className="absolute bottom-5 right-5 font-mono text-[10px] tracking-[0.2em] text-white/20 md:bottom-8 md:right-12 md:text-xs">
        {num} / {pad(total)}
      </span>
    </section>
  );
};

export default ProjectPanel;
