"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders into <body>.
 *
 * Every page is wrapped in a framer-motion div that animates `y`, and any
 * non-none transform makes `position: fixed` resolve against that element
 * instead of the viewport. Full-screen overlays rendered in place therefore
 * got laid out inside a multi-viewport-tall box — the header was visible but
 * the centred image sat far below the fold, with the page scroll locked.
 * Portalling out of the transformed subtree is the fix.
 */
const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? createPortal(children, document.body) : null;
};

export default Portal;
