"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroPortrait from "../../../public/hero.png";
import Link from "next/link";
import CvViewer from "@/components/cvViewer";

const TITLE = "Crafting Digital Experiences, Designing Tomorrow.";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const Hero = ({ cvHref }: { cvHref: string | null }) => (
  <motion.div
    className="h-full overflow-y-auto"
    initial={{ y: "-200vh" }}
    animate={{ y: "0%" }}
    transition={{ duration: 1 }}>
    <div className="flex min-h-full flex-col items-center gap-8 px-4 py-8 sm:px-8 md:px-12 lg:flex-row lg:gap-14 lg:px-20 lg:py-0 xl:px-48">
      {/* PORTRAIT — the artwork is transparent line-art with a lot of
          near-black in it, so it needs a light ground to read. */}
      <motion.div
        className="flex w-full shrink-0 items-center justify-center lg:w-1/2 lg:py-4"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="flex w-full items-center justify-center overflow-hidden">
          {/* Sized by the image itself. The previous `fill` version sat inside
              a chain of percentage heights that resolved to zero on desktop,
              so nothing was painted. */}
          <Image
            src={heroPortrait}
            alt="Illustrated portrait"
            sizes="(max-width: 640px) 18rem, (max-width: 1024px) 24rem, 40rem"
            priority
            placeholder="blur"
            className="h-auto max-h-[52vh] w-72 object-contain sm:w-[22rem] lg:max-h-[78vh] lg:w-full lg:max-w-[34rem] xl:max-w-[40rem]"
          />
        </motion.div>
      </motion.div>

      {/* COPY */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col items-start gap-6 lg:w-1/2 lg:justify-center">
        <motion.div
          variants={item}
          className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45 md:text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Available for work
        </motion.div>

        <h1 className="text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl xl:text-6xl">
          {TITLE.split(" ").map((word, i) => (
            <motion.span key={`${word}-${i}`} variants={item} className="inline-block">
              {word}&nbsp;
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={item}
          className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
          Welcome to my digital canvas, where innovation and creativity
          converge. With a keen eye for aesthetics and a mastery of code, my
          portfolio showcases a diverse collection of projects that reflect my
          commitment to excellence.
        </motion.p>

        <motion.div
          variants={item}
          className="flex w-full flex-wrap items-center gap-3 pb-2">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/portfolio"
              className="block rounded-full bg-accent px-6 py-3 font-semibold text-ink transition hover:brightness-110">
              View My Work
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/contact"
              className="block rounded-full border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:border-white/50 hover:text-white">
              Contact Me
            </Link>
          </motion.div>
          {cvHref && <CvViewer href={cvHref} />}
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);

export default Hero;
