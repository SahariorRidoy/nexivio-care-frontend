"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Service } from "@/types";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle, Mail, ChevronDown } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LanguageSwitch from "@/components/shared/LanguageSwitch";



/* ── Nexivio Care Logo Icon (leaf + medical cross) ── */
function LogoIcon({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
      {/* Outer circle */}
      <circle cx="24" cy="24" r="23" fill="#2e7d32" />
      {/* Leaf / teardrop shape */}
      <path
        d="M24 6 C15 6 9 13 9 20 C9 31 24 42 24 42 C24 42 39 31 39 20 C39 13 33 6 24 6Z"
        fill="white" opacity="0.15"
      />
      {/* White cross (medical) */}
      <rect x="21" y="14" width="6" height="20" rx="2" fill="white" />
      <rect x="14" y="21" width="20" height="6" rx="2" fill="white" />
      {/* Small leaves around icon */}
      <path d="M12 10 C10 8 8 12 10 14 C12 16 14 13 12 10Z" fill="white" opacity="0.5" />
      <path d="M36 10 C38 8 40 12 38 14 C36 16 34 13 36 10Z" fill="white" opacity="0.5" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [otherServicesOpen, setOtherServicesOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [apiServices, setApiServices] = useState<Service[]>([]);
  const [apiOtherServices, setApiOtherServices] = useState<Service[]>([]);
  const [apiTrainings, setApiTrainings] = useState<{ slug: string; titleEn: string; titleBn: string }[]>([]);
  const pathname = usePathname();
  const s = useSettings();
  const { t, language } = useLanguage();

  useEffect(() => {
    api.get<{ data: Service[] }>("/services")
      .then((r) => setApiServices(r.data.filter((sv) => sv.isActive)))
      .catch(() => {});
    api.get<{ data: Service[] }>("/other-services")
      .then((r) => setApiOtherServices(r.data.filter((sv) => sv.isActive)))
      .catch(() => {});
    api.get<{ data: { slug: string; titleEn: string; titleBn: string; isActive: boolean }[] }>("/training")
      .then((r) => setApiTrainings(r.data.filter((tr) => tr.isActive)))
      .catch(() => {});
  }, []);

  const serviceChildren = apiServices.map((sv) => ({
    href: `/services/${sv.slug}`,
    label: language === "en" ? sv.nameEn : sv.nameBn,
  }));

  const otherServiceChildren = apiOtherServices.map((sv) => ({
    href: `/other-services/${sv.slug}`,
    label: language === "en" ? sv.nameEn : sv.nameBn,
  }));

  const trainingChildren = apiTrainings.map((tr) => ({
    href: `/training/${tr.slug}`,
    label: language === "en" ? tr.titleEn : tr.titleBn,
  }));

  const navLinks = [
    { href: "/",              label: t.nav.home },
    { href: "/about",         label: t.nav.about },
    { href: "/services",      label: t.nav.services, children: serviceChildren },
    { href: "/other-services", label: language === "en" ? "Other Services" : "অন্যান্য সেবা", children: otherServiceChildren },
    { href: "/training",      label: language === "en" ? "Training" : "প্রশিক্ষণসমূহ", children: trainingChildren },
    { href: "/job-application", label: t.jobApplication.title },
    { href: "/notice-board",  label: t.nav.noticeBoard },
    { href: "/contact",       label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 shadow-lg">

      {/* ── TOP BAR: Logo + 3 contact blocks + Lang switch ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <LogoIcon size={52} />
              <div className="leading-tight">
                <div className="text-xl font-bold text-gray-900">
                  <span className="text-primary-800">Nexivio</span>
                  <span className="text-primary-600"> Care</span>
                </div>
                <div className="text-xs italic text-primary-600 font-medium tracking-wide">
                  Care you can trust
                </div>
              </div>
            </Link>

            {/* Contact blocks (hidden on small screens) */}
            <div className="hidden md:flex items-center gap-5 lg:gap-8">
              {/* Phone */}
              <a href={`tel:${s.phone}`}
                className="flex items-center gap-3 group">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-700 text-white shadow group-hover:bg-primary-800 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">কল করুন</p>
                  <p className="text-sm font-bold text-gray-800">{s.phone}</p>
                </div>
              </a>
              {/* WhatsApp */}
              <a href={`https://wa.me/${s.whatsapp}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow group-hover:bg-green-700 transition-colors">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">WhatsApp</p>
                  <p className="text-sm font-bold text-gray-800">{s.whatsapp}</p>
                </div>
              </a>
              {/* Email */}
              <a href={`mailto:${s.email}`}
                className="flex items-center gap-3 group">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow group-hover:bg-blue-700 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">ই-মেইল</p>
                  <p className="text-sm font-bold text-gray-800">{s.email}</p>
                </div>
              </a>
            </div>

            {/* Language switch + mobile toggle */}
            <div className="flex items-center gap-2">
              <LanguageSwitch />
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── NAV BAR: dark forest green ── */}
      <div className="bg-nav hidden lg:block">
        <div className="container mx-auto max-w-7xl px-4">
          <nav className="flex items-center h-12">
            {navLinks.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              if (link.children) {
                return (
                  <div key={link.href} className="relative group h-full flex items-center">
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 h-full px-4 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-nav-active text-white"
                          : "text-white/90 hover:bg-nav-hover hover:text-white"
                      )}
                    >
                      {link.label} <ChevronDown size={13} />
                    </Link>
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 z-50 hidden group-hover:block bg-white shadow-xl min-w-[210px] border-t-2 border-primary-600 rounded-b-lg">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center h-full px-4 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-nav-active text-white"
                      : "text-white/90 hover:bg-nav-hover hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Book service button */}
            <div className="ml-auto flex items-center h-full py-1.5 pr-1">
              <Link
                href="/book-service"
                className="flex items-center h-full px-5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded transition-colors"
              >
                {t.common.bookService}
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-nav border-t border-blue-950">
          <nav className="flex flex-col">
            {navLinks.map(link => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              if (link.children) {
                return (
                  <div key={link.href}>
                    <button
                      onClick={() => {
                        if (link.href === "/services") setServicesOpen(v => !v);
                        else if (link.href === "/other-services") setOtherServicesOpen(v => !v);
                        else setTrainingOpen(v => !v);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white/90"
                    >
                      {link.label}
                      <ChevronDown size={14} className={cn("transition-transform",
                        (link.href === "/services" ? servicesOpen : link.href === "/other-services" ? otherServicesOpen : trainingOpen) && "rotate-180"
                      )} />
                    </button>
                    {(link.href === "/services" ? servicesOpen : link.href === "/other-services" ? otherServicesOpen : trainingOpen) && (
                      <div className="bg-nav-active pl-4">
                        {link.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-white/70 hover:text-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium",
                    isActive ? "bg-nav-active text-white" : "text-white/90"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="p-3 border-t border-blue-900">
              <Link
                href="/book-service"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2.5 bg-primary-600 text-white text-sm font-bold rounded"
              >
                {t.common.bookService}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
