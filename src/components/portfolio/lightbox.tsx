"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Portal from "@/components/portal";
import type { Platform, Shot } from "@/lib/portfolio";

type Props = {
  open: boolean;
  shots: Shot[];
  index: number;
  title: string;
  accent: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
    <path
      d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Lightbox = ({
  open,
  shots,
  index,
  title,
  accent,
  onIndexChange,
  onClose,
}: Props) => {
  const total = shots.length;
  const shot = shots[index] ?? shots[0];
  const thumbsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<Platform | "all">("all");

  const webCount = useMemo(
    () => shots.filter((s) => s.platform === "web").length,
    [shots]
  );
  const mixed = webCount > 0 && webCount < shots.length;

  /** The subset on show; `index` still addresses the full list. */
  const visible = useMemo(
    () =>
      filter === "all" ? shots : shots.filter((s) => s.platform === filter),
    [shots, filter]
  );

  const pos = visible.findIndex((s) => s.src === shot?.src);

  // Switching filter while on a shot the new filter hides would strand the
  // viewer on a blank stage, so land on the first of the new set instead.
  useEffect(() => {
    if (pos !== -1 || !visible.length) return;
    onIndexChange(shots.indexOf(visible[0]));
  }, [pos, visible, shots, onIndexChange]);

  const go = useCallback(
    (delta: number) => {
      if (!visible.length) return;
      const at = visible.findIndex((s) => s.src === shot?.src);
      const next = visible[(at + delta + visible.length) % visible.length];
      onIndexChange(shots.indexOf(next));
    },
    [visible, shot, shots, onIndexChange]
  );

  // Keyboard: arrows navigate, Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  // The page behind is scroll-driven, so the scroll has to be frozen while
  // open. Locking `overflow` makes the browser drop the scroll offset, which
  // would snap the reel back to the first project on close — so the offset is
  // captured and put back, with smooth scrolling disabled so it doesn't animate.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement: html } = document;
    const offset = window.scrollY;
    const prev = {
      body: body.style.overflow,
      html: html.style.overflow,
      behavior: html.style.scrollBehavior,
    };
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    html.style.scrollBehavior = "auto";
    return () => {
      body.style.overflow = prev.body;
      html.style.overflow = prev.html;
      window.scrollTo(0, offset);
      html.style.scrollBehavior = prev.behavior;
    };
  }, [open]);

  // Scroll the strip itself rather than scrollIntoView, which can drag
  // ancestors along with it.
  useEffect(() => {
    const thumb = thumbsRef.current[pos];
    const strip = stripRef.current;
    if (!thumb || !strip) return;
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [pos]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="grain fixed inset-0 z-[100] flex flex-col bg-[#08080c]/95 backdrop-blur-xl">
          {/* header */}
          <div
            className="flex shrink-0 items-center justify-between gap-4 border-b border-white/5 px-4 py-3 md:px-8"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <h2 className="truncate text-sm font-medium tracking-tight text-white md:text-base">
                {title}
              </h2>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 sm:block">
                Gallery
              </span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              {/* Only projects that ship both surfaces get the switch. */}
              {mixed && (
                <div className="flex items-center gap-0.5 rounded-full bg-white/[0.06] p-0.5 ring-1 ring-white/10">
                  {(
                    [
                      ["all", `All ${shots.length}`],
                      ["web", `Web ${webCount}`],
                      ["mobile", `App ${shots.length - webCount}`],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition md:text-[11px] ${
                        filter === key
                          ? "text-[#08080c]"
                          : "text-white/50 hover:text-white"
                      }`}
                      style={
                        filter === key
                          ? { backgroundColor: accent }
                          : undefined
                      }>
                      {label}
                    </button>
                  ))}
                </div>
              )}

              <span className="font-mono text-xs tabular-nums text-white/45">
                <span style={{ color: accent }}>
                  {String(pos + 1).padStart(2, "0")}
                </span>
                <span className="mx-1 text-white/25">/</span>
                {String(visible.length).padStart(2, "0")}
              </span>
              <button
                onClick={onClose}
                aria-label="Close gallery"
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none text-white/70 ring-1 ring-white/15 transition hover:bg-white/10 hover:text-white">
                &times;
              </button>
            </div>
          </div>

          {/* stage */}
          {/* The stage is sized by absolute insets rather than h-full: a
              percentage height inside a flex item can collapse to zero, which
              is what made the enlarged shot disappear. */}
          <div
            className="relative min-h-0 flex-1"
            onClick={(e) => e.stopPropagation()}>
            {total > 1 && (
              <button
                onClick={() => go(-1)}
                aria-label="Previous screenshot"
                className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/15 hover:text-white md:left-5 md:h-12 md:w-12">
                <Arrow dir="left" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={shot.src}
                className="absolute inset-0 flex items-center justify-center p-3 md:px-20 md:py-6"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.2 }}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  if (info.offset.x > 60) go(-1);
                }}>
                {/* Intrinsic width/height rather than `fill`: the image sizes
                    itself and can never collapse with its container. */}
                <Image
                  src={shot.src}
                  alt={`${title} screenshot ${index + 1}`}
                  width={shot.width}
                  height={shot.height}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                  draggable={false}
                  className="max-h-full w-auto max-w-full rounded-xl object-contain ring-1 ring-white/10"
                />
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <button
                onClick={() => go(1)}
                aria-label="Next screenshot"
                className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/15 hover:text-white md:right-5 md:h-12 md:w-12">
                <Arrow dir="right" />
              </button>
            )}
          </div>

          {/* thumbnails */}
          {total > 1 && (
            <div
              className="shrink-0 border-t border-white/5 px-4 py-3 md:px-8"
              onClick={(e) => e.stopPropagation()}>
              {/* w-max + mx-auto centres a short strip but still scrolls
                  correctly once 15 thumbnails outgrow the viewport, which
                  justify-center alone would clip on the left. */}
              <div ref={stripRef} className="no-scrollbar overflow-x-auto">
                <div className="mx-auto flex w-max gap-2">
                {visible.map((shot, i) => (
                  <button
                    key={shot.src}
                    ref={(el) => {
                      thumbsRef.current[i] = el;
                    }}
                    onClick={() => onIndexChange(shots.indexOf(shot))}
                    aria-label={`Go to screenshot ${i + 1}`}
                    className={`relative h-10 w-16 shrink-0 overflow-hidden rounded transition md:h-12 md:w-[76px] ${
                      i === pos
                        ? "opacity-100"
                        : "opacity-35 hover:opacity-75"
                    }`}
                    style={
                      i === pos
                        ? { boxShadow: `0 0 0 2px ${accent}` }
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
              </div>
              <p className="mt-2.5 hidden text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/25 md:block">
                &larr; &rarr; navigate &middot; esc to close
              </p>
            </div>
          )}
        </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Lightbox;
