"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ title, url }: { title: string; url: string }) => {
  const pathName = usePathname();

  return (
    <Link
      className={`rounded p-1 ${pathName === url && "bg-black text-white"}`}
      href={url}>
      {title}
    </Link>
  );
};

export default NavLink;
