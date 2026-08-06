"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Service, OtherService } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MessageCircle, Mail, ChevronDown } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LanguageSwitch from "@/components/shared/LanguageSwitch";



export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [otherServicesOpen, setOtherServicesOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [transportationOpen, setTransportationOpen] = useState(false);
  const [apiServices, setApiServices] = useState<Service[]>([]);
  const [apiOtherServices, setApiOtherServices] = useState<OtherService[]>([]);
  const [apiTrainings, setApiTrainings] = useState<{ slug: string; titleEn: string; titleBn: string }[]>([]);
  const pathname = usePathname();
  const s = useSettings();
  const { t, language } = useLanguage();

  useEffect(() => {
    api.get<{ data: Service[] }>("/services")
      .then((r) => setApiServices(r.data.filter((sv) => sv.isActive)))
      .catch(() => {});
    api.get<{ data: OtherService[] }>("/other-services")
      .then((r) => setApiOtherServices(r.data.filter((sv) => sv.isActive)))
      .catch(() => {});
    api.get<{ data: { slug: string; titleEn: string; titleBn: string; isActive: boolean }[] }>("/training")
      .then((r) => setApiTrainings(r.data.filter((tr) => tr.isActive)))
      .catch(() => {});
  }, []);

  const STATIC_SERVICES = [
    { slug: "physiotherapy-rehabilitation", labelEn: "Physiotherapy & Rehabilitation", labelBn: "ফিজিওথেরাপি ও পুনর্বাসন" },
    { slug: "on-demand-nursing",            labelEn: "On-Demand Nursing",             labelBn: "অন-ডিমান্ড নার্সিং" },
    { slug: "home-diagnostics",             labelEn: "Home Diagnostics",              labelBn: "হোম ডায়াগনস্টিক্স" },
  ];

  const dynamicServiceSlugs = new Set(apiServices.map((sv) => sv.slug));
  const serviceChildren = [
    ...apiServices.map((sv) => ({
      href: `/services/${sv.slug}`,
      label: language === "en" ? sv.nameEn : sv.nameBn,
    })),
    ...STATIC_SERVICES.filter((sv) => !dynamicServiceSlugs.has(sv.slug)).map((sv) => ({
      href: `/services/${sv.slug}`,
      label: language === "en" ? sv.labelEn : sv.labelBn,
    })),
  ];

  const STATIC_OTHER_SERVICES = [
    { slug: "doctor-consultation",       labelEn: "Doctor Consultation",       labelBn: "ডাক্তার পরামর্শ" },
    { slug: "doctor-home-visit",         labelEn: "Doctor Home Visit",         labelBn: "ডাক্তার হোম ভিজিট" },
    { slug: "medical-equipment",         labelEn: "Medical Equipment",         labelBn: "মেডিকেল সরঞ্জাম" },
    { slug: "hospital-visit-assistance", labelEn: "Hospital Visit Assistance", labelBn: "হাসপাতাল ভিজিট সহায়তা" },
    { slug: "ambulance-service",         labelEn: "Ambulance Service",         labelBn: "অ্যাম্বুলেন্স সেবা" },
    { slug: "other-support-services",    labelEn: "Other Support Services",    labelBn: "অন্যান্য সহায়তা সেবা" },
  ];

  const TRANSPORTATION_SERVICES = [
    { slug: "transportation-services",   labelEn: "Transportation Services",   labelBn: "পরিবহন সেবা" },
    { slug: "ambulance-service",         labelEn: "Ambulance Service",         labelBn: "অ্যাম্বুলেন্স সেবা" },
    { slug: "hospital-visit-assistance", labelEn: "Hospital Visit Assistance", labelBn: "হাসপাতাল ভিজিট সহায়তা" },
  ];

  const transportationChildren = TRANSPORTATION_SERVICES.map((sv) => ({
    href: `/other-services/${sv.slug}`,
    label: language === "en" ? sv.labelEn : sv.labelBn,
  }));

  const dynamicSlugs = new Set(apiOtherServices.map((sv) => sv.slug));
  const otherServiceChildren = [
    ...STATIC_OTHER_SERVICES.filter((sv) => !dynamicSlugs.has(sv.slug)).map((sv) => ({
      href: `/other-services/${sv.slug}`,
      label: language === "en" ? sv.labelEn : sv.labelBn,
    })),
    ...apiOtherServices.map((sv) => ({
      href: `/other-services/${sv.slug}`,
      label: language === "en" ? sv.nameEn : sv.nameBn,
    })),
  ];

  const trainingChildren = apiTrainings.map((tr) => ({
    href: `/training/${tr.slug}`,
    label: language === "en" ? tr.titleEn : tr.titleBn,
  }));

  const isBn = language === "bn";

  const navLinks = [
    { href: "/",               label: t.nav.home },
    { href: "/about",          label: t.nav.about, megaAbout: true },
    { href: "/services",       label: language === "en" ? "Our Services" : "আমাদের সেবা", children: serviceChildren },
    { href: "/other-services", label: language === "en" ? "Additional Services" : "অতিরিক্ত সেবা", children: otherServiceChildren },
    { href: "/transportation",  label: language === "en" ? "Transportation" : "পরিবহন", children: transportationChildren },
    { href: "/training",       label: language === "en" ? "Training" : "প্রশিক্ষণসমূহ", children: trainingChildren },
    { href: "/gallery",        label: t.nav.gallery },
    { href: "/notice-board",   label: t.nav.noticeBoard },
    { href: "/contact",        label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 shadow-lg">

      {/* ── TOP BAR: Logo + 3 contact blocks + Lang switch ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image src="/logo.jpeg" alt="Nexivio Care" width={56} height={56} className="object-contain" priority />
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
              if ("megaAbout" in link && link.megaAbout) {
                return (
                  <div key={link.href} className="relative group h-full flex items-center">
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 h-full px-4 text-sm font-medium transition-colors",
                        isActive ? "bg-nav-active text-white" : "text-white/90 hover:bg-nav-hover hover:text-white"
                      )}
                    >
                      {link.label} <ChevronDown size={13} />
                    </Link>
                    {/* Mega dropdown */}
                    <div className="absolute top-full left-0 z-50 hidden group-hover:flex bg-white shadow-2xl border-t-2 border-primary-600 rounded-b-lg w-[480px]">
                      {/* Left — About sections */}
                      <div className="w-1/2 p-5 border-r border-slate-100">
                        <p className="text-xs font-bold tracking-widest uppercase text-primary-600 mb-3">
                          {isBn ? "আমাদের সম্পর্কে" : "About Us"}
                        </p>
                        <div className="space-y-1">
                          {[
                            { href: "/about#profile",     label: isBn ? "কোম্পানি প্রোফাইল"   : "Company Profile" },
                            { href: "/about#mission",     label: isBn ? "আমাদের মিশন"        : "Our Mission" },
                            { href: "/about#vision",      label: isBn ? "আমাদের ভিশন"        : "Our Vision" },
                            { href: "/about#future-plan", label: isBn ? "ভবিষ্যৎ পরিকল্পনা" : "Our Future Plan" },
                            { href: "/about#office",      label: isBn ? "আমাদের অফিস"        : "Our Office" },
                            
                          ].map(item => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* Right — Human Resources + Notice Board */}
                      <div className="w-1/2 p-5">
                        <p className="text-xs font-bold tracking-widest uppercase text-primary-600 mb-3">
                          {isBn ? "মানব সম্পদ" : "Human Resources"}
                        </p>
                        <div className="space-y-1">
                          {[
                            { href: "/about#team",      label: isBn ? "ম্যানেজমেন্ট টিম" : "Management Team" },
                            { href: "/about#staff",     label: isBn ? "আমাদের কর্মীবৃন্দ" : "Our Staff" },
                            { href: "/job-application", label: isBn ? "চাকরির আবেদন" : "Job Application" },
                          ].map(item => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <p className="text-xs font-bold tracking-widest uppercase text-primary-600 mt-4 mb-3">
                          {isBn ? "নোটিশ বোর্ড" : "Notice Board"}
                        </p>
                        <div className="space-y-1">
                          <Link
                            href="/notice-board"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                            {isBn ? "নোটিশ বোর্ড" : "Notice Board"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
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
                    <div className="absolute top-full left-0 z-50 hidden group-hover:block bg-white shadow-xl min-w-[220px] border-t-2 border-primary-600 rounded-b-lg py-1">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-600 hover:text-white transition-colors group/item"
                        >
                          <span className="w-4 h-[2px] bg-primary-400 shrink-0 rounded-full group-hover/item:bg-white" />
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
              if ("megaAbout" in link && link.megaAbout) {
                return (
                  <div key={link.href}>
                    <button
                      onClick={() => setAboutOpen(v => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white/90"
                    >
                      {link.label}
                      <ChevronDown size={14} className={cn("transition-transform", aboutOpen && "rotate-180")} />
                    </button>
                    {aboutOpen && (
                      <div className="bg-nav-active pl-4">
                        {[
                          { href: "/about#profile",     label: isBn ? "কোম্পানি প্রোফাইল"   : "Company Profile" },
                          { href: "/about#mission",     label: isBn ? "আমাদের মিশন"        : "Our Mission" },
                          { href: "/about#vision",      label: isBn ? "আমাদের ভিশন"        : "Our Vision" },
                          { href: "/about#future-plan", label: isBn ? "ভবিষ্যৎ পরিকল্পনা" : "Our Future Plan" },
                          { href: "/about#office",      label: isBn ? "আমাদের অফিস"        : "Our Office" },
                          { href: "/about#team",        label: isBn ? "ম্যানেজমেন্ট টিম"   : "Management Team" },
                          { href: "/about#staff",       label: isBn ? "আমাদের কর্মীবৃন্দ"  : "Our Staff" },
                          { href: "/job-application",   label: isBn ? "চাকরির আবেদন"       : "Job Application" },
                          { href: "/notice-board",      label: isBn ? "নোটিশ বোর্ড"        : "Notice Board" },
                        ].map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-white/70 hover:text-white"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              if (link.children) {
                return (
                  <div key={link.href}>
                    <button
                      onClick={() => {
                        if (link.href === "/services") setServicesOpen(v => !v);
                        else if (link.href === "/other-services") setOtherServicesOpen(v => !v);
                        else if (link.href === "/transportation") setTransportationOpen(v => !v);
                        else setTrainingOpen(v => !v);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white/90"
                    >
                      {link.label}
                      <ChevronDown size={14} className={cn("transition-transform",
                        (link.href === "/services" ? servicesOpen : link.href === "/other-services" ? otherServicesOpen : link.href === "/transportation" ? transportationOpen : trainingOpen) && "rotate-180"
                      )} />
                    </button>
                    {(link.href === "/services" ? servicesOpen : link.href === "/other-services" ? otherServicesOpen : link.href === "/transportation" ? transportationOpen : trainingOpen) && (
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
