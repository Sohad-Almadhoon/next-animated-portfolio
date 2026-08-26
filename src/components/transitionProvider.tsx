"use client";

import { AnimatePresence } from "framer-motion";
import Navbar from "./navbar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/** The curtain used to flash the raw path ("portfolio"); these read properly. */
const LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/portfolio": "Work",
  "/contact": "Contact",
};

const TransitionProvider = ({
  children,
  cvHref,
}: {
  children: ReactNode;
  cvHref: string | null;
}) => {
  const pathName = usePathname();
  const label = LABELS[pathName] ?? pathName.replace("/", "") ?? "";

  return (
    <AnimatePresence mode="wait">
      <div
        key={pathName}
        className="w-screen h-screen bg-ink text-white">
        <motion.div
          className="h-screen w-screen fixed bg-curtain rounded-b-[100px] z-40"
          animate={{ height: "0vh" }}
          exit={{ height: "140vh" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 m-auto flex h-fit w-fit flex-col items-center gap-3"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}>
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
                  delay: 0.06 + i * 0.035,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block">
                {letter}
              </motion.span>
            ))}
          </span>

          <motion.span
            className="h-px bg-accent"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>
        <motion.div
          className="h-screen w-screen fixed bg-curtain rounded-t-[100px] bottom-0 z-30"
          initial={{ height: "140vh" }}
          animate={{ height: "0vh", transition: { delay: 0.5 } }}
        />
        <div className="h-24">
          <Navbar cvHref={cvHref} />
        </div>
        <div className="h-[calc(100vh-6rem)]">{children}</div>
      </div>
    </AnimatePresence>
  );
};

export default TransitionProvider;
