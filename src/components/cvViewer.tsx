"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Portal from "@/components/portal";

const DocIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const CvViewer = ({
  href,
  variant = "nav",
}: {
  href: string;
  /** "nav" is the compact pill; "card" is the full block used on About. */
  variant?: "nav" | "card";
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {variant === "nav" ? (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-sm text-white/75 transition hover:border-accent hover:text-white">
          <DocIcon className="h-4 w-4" />
          CV
        </motion.button>
      ) : (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.985 }}
          className="group flex w-full items-center gap-4 rounded-2xl bg-surface p-5 text-left ring-1 ring-white/10 transition hover:ring-accent/50">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
            <DocIcon className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Curriculum Vitae</span>
            <span className="block text-sm text-white/50">
              Read it here, or download the PDF
            </span>
          </span>
          <span className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-white/35 transition group-hover:text-accent">
            Open
          </span>
        </motion.button>
      )}

      <Portal>
        <AnimatePresence>
          {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[110] flex flex-col bg-ink/95 backdrop-blur-xl">
            <div
              className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-2 md:px-6"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <h2 className="text-sm font-medium md:text-base">
                  Curriculum Vitae
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={href}
                  download
                  className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-ink transition hover:brightness-110">
                  Download
                </a>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 transition hover:border-white/50 hover:text-white">
                  New tab &#8599;
                </a>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close CV"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none text-white/70 ring-1 ring-white/15 transition hover:bg-white/10 hover:text-white">
                  &times;
                </button>
              </div>
            </div>

            <div
              className="relative min-h-0 flex-1 md:p-1.5"
              onClick={(e) => e.stopPropagation()}>
              {/* Mobile browsers mostly refuse to render a PDF in an iframe,
                  so they get the actions instead of a blank frame. */}
              <iframe
                src={`${href}#view=FitH&toolbar=1&navpanes=0`}
                title="Curriculum Vitae"
                className="hidden h-full w-full rounded-lg border-0 bg-white md:block"
              />
              <div className="absolute inset-4 flex flex-col items-center justify-center gap-5 rounded-xl bg-surface px-6 text-center ring-1 ring-white/10 md:hidden">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/30">
                  <DocIcon className="h-8 w-8" />
                </span>
                <p className="text-sm text-white/55">
                  PDF preview isn&apos;t supported on most phones — open or save
                  it instead.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink">
                    Open CV &#8599;
                  </a>
                  <a
                    href={href}
                    download
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80">
                    Download
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default CvViewer;
