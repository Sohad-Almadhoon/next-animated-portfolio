"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const OFFSET = 28;

const directions = {
  up: { x: 0, y: OFFSET },
  down: { x: 0, y: -OFFSET },
  left: { x: OFFSET, y: 0 },
  right: { x: -OFFSET, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Fades a block in the first time it enters the viewport. `root` scopes the
 * observer to a scroll container (the About page scrolls inside a div, not
 * the window), otherwise it never fires.
 */
const Reveal = ({
  children,
  from = "up",
  delay = 0,
  className = "",
  root,
}: {
  children: ReactNode;
  from?: keyof typeof directions;
  delay?: number;
  className?: string;
  root?: React.RefObject<Element>;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, ...directions[from] }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, amount: 0.2, root }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

/** Parent/child pair for staggering a list of small items. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default Reveal;
