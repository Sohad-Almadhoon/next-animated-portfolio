"use client";

import Brain from "@/components/brain";
import CvViewer from "@/components/cvViewer";
import Reveal, { stagger, staggerItem } from "@/components/reveal";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Supabase",
  "SCSS",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "Node.js",
  "Nest.js",
  "Express.js",
  "GraphQL",
  "Redux",
  "Framer Motion",
  "Three.js",
  "Bootstrap",
  "Vite",
  "Firebase",
  "Git",
  "Figma",
];

const EXPERIENCE = [
  {
    title: "Reactjs Engineer",
    desc: "I spearheaded React-based application development, leveraging advanced skills.",
    date: "2023 - Present",
    company: "Elite Hair",
  },
  {
    title: "Nextjs Developer (Freelancer)",
    desc: "Build many projects with nextjs and other technologies.",
    date: "2022 - 2023",
    company: "Upwork",
  },
  {
    title: "Problem Solver",
    desc: "Practicing problem solving on programming problems with c++.",
    date: "2020 - 2022",
    company: "Coach Academy",
  },
];

const ScrollCue = () => (
  <motion.svg
    initial={{ opacity: 0.2, y: 0 }}
    animate={{ opacity: 1, y: 10 }}
    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    viewBox="0 0 24 24"
    fill="none"
    width={44}
    height={44}
    className="text-white/50">
    <path
      d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path d="M12 6V14" stroke="currentColor" strokeWidth="1" />
    <path d="M15 11L12 14L9 11" stroke="currentColor" strokeWidth="1" />
  </motion.svg>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4">
    <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 md:text-sm">
      {children}
    </h2>
    <span className="h-px flex-1 bg-white/10" />
  </div>
);

const AboutClient = ({ cvHref }: { cvHref: string | null }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}>
      <div className="h-full overflow-y-auto lg:flex" ref={containerRef}>
        {/* TEXT COLUMN */}
        <div className="flex flex-col gap-20 p-4 sm:p-8 md:gap-28 md:p-12 lg:w-2/3 lg:gap-36 lg:p-20 lg:pr-0 xl:w-1/2 xl:p-32">
          {/* BIOGRAPHY */}
          <section className="flex flex-col gap-8">
            <Reveal root={containerRef} from="none">
              <Image
                src="/sohad.jpg"
                width={96}
                height={96}
                alt="Sohad Almadhoon"
                className="h-24 w-24 rounded-full object-cover ring-1 ring-white/15"
              />
            </Reveal>

            <Reveal root={containerRef} delay={0.05}>
              <SectionTitle>Biography</SectionTitle>
            </Reveal>

            <Reveal root={containerRef} delay={0.1}>
              <p className="max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
                As an expert MERN stack developer, I can help transform your
                ideas into outstanding web applications with clean and efficient
                code. I believe that simplicity drives both performance and
                clarity. I am a dedicated professional with a proven ability to
                thrive in self-starting environments and collaborate effectively
                with other developers. My passion for web development and
                personal growth fuels my commitment to delivering high-quality
                work.
              </p>
            </Reveal>

            <Reveal root={containerRef} delay={0.15}>
              <p className="border-l-2 border-accent pl-4 text-lg italic text-white/75">
                Simplicity is the soul of efficiency.
              </p>
            </Reveal>

            {cvHref && (
              <Reveal root={containerRef} delay={0.2} className="max-w-md">
                <CvViewer href={cvHref} variant="card" />
              </Reveal>
            )}

            <ScrollCue />
          </section>

          {/* SKILLS */}
          <section className="flex flex-col gap-8">
            <Reveal root={containerRef}>
              <SectionTitle>Skills</SectionTitle>
            </Reveal>

            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15, root: containerRef }}
              className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <motion.li
                  key={skill}
                  variants={staggerItem}
                  whileHover={{ y: -3 }}
                  className="cursor-default rounded-full bg-white/[0.06] px-3 py-1.5 text-sm text-white/75 ring-1 ring-white/10 transition-colors hover:bg-white hover:text-ink">
                  {skill}
                </motion.li>
              ))}
            </motion.ul>

            <ScrollCue />
          </section>

          {/* EXPERIENCE */}
          <section className="flex flex-col gap-8 pb-24">
            <Reveal root={containerRef}>
              <SectionTitle>Experience</SectionTitle>
            </Reveal>

            {/* One rail on the left at every size — the old three-column
                version squeezed each card into a third of the screen. */}
            <ol className="relative flex flex-col gap-10 pl-8">
              <span className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10" />

              {EXPERIENCE.map((job, i) => (
                <Reveal
                  key={job.title}
                  root={containerRef}
                  from="left"
                  delay={i * 0.08}>
                  <li className="relative">
                    <span
                      className="absolute -left-8 top-1.5 h-[11px] w-[11px] rounded-full bg-ink ring-[3px]"
                      style={{ boxShadow: "0 0 0 3px #7C93F5" }}
                    />
                    <div className="rounded-xl bg-surface p-4 ring-1 ring-white/10 md:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold md:text-lg">{job.title}</h3>
                        <span className="font-mono text-xs text-accent">
                          {job.date}
                        </span>
                      </div>
                      <p className="mt-2 text-sm italic text-white/55">
                        {job.desc}
                      </p>
                      <span className="mt-3 inline-block rounded bg-white/[0.06] px-2 py-1 text-xs font-semibold ring-1 ring-white/10">
                        {job.company}
                      </span>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>
        </div>

        {/* BRAIN */}
        <div className="sticky top-0 z-30 hidden w-1/3 lg:block xl:w-1/2">
          <Brain scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </motion.div>
  );
};

export default AboutClient;
