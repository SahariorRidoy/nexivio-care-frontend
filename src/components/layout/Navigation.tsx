"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/services", key: "services" as const },
  { href: "/training", key: "training" as const },
  { href: "/notice-board", key: "noticeBoard" as const },
  { href: "/gallery", key: "gallery" as const },
  { href: "/reviews", key: "reviews" as const },
  { href: "/contact", key: "contact" as const },
];

interface NavigationProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

export default function Navigation({ mobile = false, onLinkClick }: NavigationProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      className={cn(
        mobile
          ? "flex flex-col gap-1 p-4"
          : "hidden lg:flex items-center gap-1"
      )}
    >
      {navLinks.map(({ href, key }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-50 text-primary-700 font-semibold"
                : "text-slate-600 hover:text-primary-600 hover:bg-slate-50"
            )}
          >
            {t.nav[key]}
          </Link>
        );
      })}
    </nav>
  );
}
