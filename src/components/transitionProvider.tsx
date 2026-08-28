"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "./navbar";

/** The curtain used to flash the raw path ("portfolio"); these read properly. */
const LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/portfolio": "Work",
  "/contact": "Contact",
};

/** Longest the curtain may ever stay on screen, animation or not. */
const FAILSAFE_MS = 1800;

const TransitionProvider = ({
  children,
  cvHref,
}: {
  children: ReactNode;
  cvHref: string | null;
}) => {
  const pathName = usePathname();
  const label = LABELS[pathName] ?? pathName.replace("/", "");
  const [covering, setCovering] = useState(true);

  useEffect(() => {
    setCovering(true);
    // Belt and braces: if the animation never reports completion (a dropped
    // frame budget, a reduced-motion setting, an interrupted navigation) the
    // curtain still comes down on its own.
    const failsafe = setTimeout(() => setCovering(false), FAILSAFE_MS);
    return () => clearTimeout(failsafe);
  }, [pathName]);

  return (
    <div className="h-screen w-screen bg-ink text-white">
      {/*
        The curtain is a sibling of the content, never a gate in front of it.
        The previous version wrapped everything in <AnimatePresence mode="wait">,
        so the incoming page only mounted after the outgoing page finished its
        exit — and when that exit never completed (clicking a link mid-
        transition does it) the beige panel stayed up and no page ever appeared.
        Here the page is always mounted; the curtain merely uncovers it, is
        pointer-transparent, and unmounts itself when it is done.
      */}
      {covering && (
        <motion.div
          key={pathName}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => setCovering(false)}
          className="pointer-events-none fixed inset-0 z-50 origin-top bg-curtain">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute inset-0 m-auto flex h-fit w-fit flex-col items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink/45 md:text-xs">
              Sohad.dev
            </span>

            <span className="flex overflow-hidden text-5xl font-semibold tracking-[-0.03em] text-ink sm:text-7xl md:text-8xl">
              {label.split("").map((letter, i) => (
                <motion.span
                  key={`${pathName}-${i}`}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    delay: i * 0.035,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block">
                  {letter}
                </motion.span>
              ))}
            </span>

            <motion.span
              className="h-px w-full bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      )}

      <div className="h-24">
        <Navbar cvHref={cvHref} />
      </div>
      <div className="h-[calc(100vh-6rem)]">{children}</div>
    </div>
  );
};

export default TransitionProvider;
