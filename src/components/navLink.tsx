"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ title, url }: { title: string; url: string }) => {
  const pathName = usePathname();
  const active = pathName === url;

  return (
    <Link href={url} className="group relative px-2 py-1">
      <span
        className={`relative z-10 transition-colors ${
          active ? "text-ink" : "text-white/60 group-hover:text-white"
        }`}>
        {title}
      </span>

      {/* the pill slides between links instead of snapping */}
      {active && (
        <motion.span
          layoutId="nav-active"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded bg-white"
        />
      )}

      {!active && (
        <span className="absolute bottom-0 left-2 right-2 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
      )}
    </Link>
  );
};

export default NavLink;
