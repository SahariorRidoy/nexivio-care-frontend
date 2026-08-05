"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Phone, MessageCircle, Bell, FileText, ArrowRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { assetUrl } from "@/lib/utils";
import type { Notice } from "@/types";

type BannerType = "offer" | "campaign" | "training" | "service";

interface Banner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string | null;
  subtitleEn: string | null;
  image: string;
  ctaLink: string | null;
  type?: BannerType;
  isActive: boolean;
  order: number;
}

const TYPE_BADGES: Record<BannerType, { label: string; className: string }> = {
  offer:    { label: "Running Offer",          className: "bg-red-500 text-white" },
  campaign: { label: "Promotional Campaign",   className: "bg-orange-500 text-white" },
  training: { label: "Training Announcement",  className: "bg-blue-600 text-white" },
  service:  { label: "Care Service Promotion", className: "bg-green-600 text-white" },
};

const FALLBACK_SLIDES: Banner[] = [
  {
    id: "1", titleBn: "আপনার প্রিয়জনের যত্নে আমরা আছি পাশে",
    titleEn: "We Are Here For Your Loved Ones",
    subtitleBn: "সারা বাংলাদেশে বিশ্বস্ত কেয়ারগিভিং, নার্সিং ও বেবি কেয়ার সেবা প্রদান করি",
    subtitleEn: "Trusted caregiving, nursing and baby care services across Bangladesh",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=85&auto=format&fit=crop",
    ctaLink: "/book-service", isActive: true, order: 1,
  },
  {
    id: "2", titleBn: "প্রশিক্ষিত ও যাচাইকৃত কেয়ারগিভার",
    titleEn: "Trained & Verified Caregivers",
    subtitleBn: "আমাদের সকল কর্মী পেশাদারভাবে প্রশিক্ষিত এবং যাচাইকৃত",
    subtitleEn: "All our staff are professionally trained and verified",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85&auto=format&fit=crop",
    ctaLink: "/services", isActive: true, order: 2,
  },
  {
    id: "3", titleBn: "প্রশিক্ষণ কোর্সে ভর্তি চলছে",
    titleEn: "Training Course Enrollment Open",
    subtitleBn: "কেয়ারগিভার, নার্সিং ও বেবি কেয়ার প্রশিক্ষণে যোগ দিন",
    subtitleEn: "Join our caregiver, nursing and baby care training programs",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=85&auto=format&fit=crop",
    ctaLink: "/training", isActive: true, order: 3,
  },
];

const typeConfig: Record<string, { labelBn: string; labelEn: string; bg: string }> = {
  job:      { labelBn: "নতুন",   labelEn: "New",    bg: "bg-green-500" },
  training: { labelBn: "আপডেট", labelEn: "Update", bg: "bg-orange-500" },
  circular: { labelBn: "জরুরি", labelEn: "Urgent", bg: "bg-red-500" },
  general:  { labelBn: "নোটিস", labelEn: "Notice", bg: "bg-blue-600" },
};

export default function HeroBanner() {
  const [slides, setSlides] = useState<Banner[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const s = useSettings();
  const { language, t } = useLanguage();
  const isBn = language === "bn";

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
    fetch(`${apiUrl}/banners`)
      .then((r) => r.json())
      .then((json) => {
        const active: Banner[] = (json?.data ?? []).filter((b: Banner) => b.isActive);
        if (active.length > 0) setSlides(active);
      })
      .catch(() => {});
    api.get<{ data: Notice[] }>("/notices")
      .then((r) => setNotices(r.data.filter((n) => n.isActive).slice(0, 6)))
      .catch(() => {});
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setAnimating(false), 400);
    },
    [animating, slides.length]
  );

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 5500);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];
  const title    = isBn ? slide.titleBn    : slide.titleEn;
  const subtitle = isBn ? (slide.subtitleBn ?? slide.subtitleEn) : (slide.subtitleEn ?? slide.subtitleBn);

  return (
    <section className="bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">

          {/* ── LEFT: Notice + About (1/4) ────────────────────────────── */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4 order-last lg:order-first">

            {/* About Us card */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white">
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #0C2468, #1a3a8f)" }}>
                <span className="text-lg">🏥</span>
                <h3 className="text-white font-bold text-sm">{t.about.title}</h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {t.home.intro.description}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { num: "500+", label: isBn ? "পরিবার" : "Families" },
                    { num: "24/7", label: isBn ? "সহায়তা" : "Support" },
                  ].map(({ num, label }) => (
                    <div key={label} className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                      <p className="text-base font-bold" style={{ color: "#0C2468" }}>{num}</p>
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors"
                >
                  {t.common.learnMore} <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Notice Board card */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white flex flex-col">
              <div className="px-4 py-3 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #0C2468, #1a3a8f)" }}>
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-white" />
                  <h3 className="text-white font-bold text-sm">{t.nav.noticeBoard}</h3>
                </div>
                <Link href="/notice-board" className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md font-medium transition-colors">
                  {isBn ? "সব দেখুন" : "View All"}
                </Link>
              </div>

              {notices.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <p className="text-xs text-slate-400 text-center">{t.home.noticeBoard.noNotices}</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                  {notices.map((notice) => {
                    const cfg = typeConfig[notice.type] ?? typeConfig.general;
                    return (
                      <div key={notice.id} className="flex items-start gap-2.5 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <span className={`shrink-0 text-white text-xs font-bold px-2 py-0.5 rounded mt-0.5 ${cfg.bg}`}>
                          {isBn ? cfg.labelBn : cfg.labelEn}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-700 line-clamp-2 leading-relaxed">
                            {isBn ? notice.titleBn : notice.titleEn}
                          </p>
                          {notice.documentUrl && (
                            <a
                              href={assetUrl(notice.documentUrl)}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-0.5"
                            >
                              <FileText size={10} /> {t.home.noticeBoard.downloadDocument}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT: Slider (3/4) ────────────────────────────────────── */}
          <div className="relative w-full lg:w-3/4 rounded-2xl overflow-hidden shadow-xl order-first lg:order-last" style={{ minHeight: "420px" }}>
            {/* Background image */}
            <div
              className={cn("absolute inset-0 bg-cover bg-center transition-opacity duration-500", animating ? "opacity-0" : "opacity-100")}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

            {/* Content */}
            <div className={cn("relative h-full flex flex-col justify-end p-8 lg:p-10 transition-opacity duration-400", animating ? "opacity-0" : "opacity-100")} style={{ minHeight: "420px" }}>
              {slide.type && TYPE_BADGES[slide.type] && (
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-3 ${TYPE_BADGES[slide.type].className}`}>
                  {TYPE_BADGES[slide.type].label}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 max-w-xl drop-shadow-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/80 text-sm lg:text-base max-w-lg mb-6 leading-relaxed">
                  {subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${s.phone}`}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  <Phone size={15} /> {s.phone}
                </a>
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500/80 hover:bg-green-500 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                {slide.ctaLink && (
                  <Link
                    href={slide.ctaLink}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
                  >
                    {t.common.bookService}
                  </Link>
                )}
              </div>
            </div>

            {/* Prev / Next */}
            <button
              onClick={() => goTo(current - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white transition-all"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn("h-1.5 rounded-full transition-all", i === current ? "w-6 bg-white" : "w-1.5 bg-white/40")}
                />
              ))}
            </div>

            {/* Slide counter */}
            <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/20">
              {current + 1} / {slides.length}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
