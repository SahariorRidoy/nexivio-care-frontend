"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Phone, MessageCircle, Bell, FileText, ArrowRight, CalendarCheck } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn, assetUrl, downloadFile } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Notice } from "@/types";

interface Banner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string | null;
  subtitleEn: string | null;
  image: string;
  subtitleStyle?: string;
  isActive: boolean;
  order: number;
}

const typeConfig: Record<string, { labelBn: string; labelEn: string; bg: string }> = {
  job:      { labelBn: "নতুন",   labelEn: "New",    bg: "bg-green-500" },
  training: { labelBn: "আপডেট", labelEn: "Update", bg: "bg-orange-500" },
  circular: { labelBn: "জরুরি", labelEn: "Urgent", bg: "bg-red-500" },
  general:  { labelBn: "নোটিস", labelEn: "Notice", bg: "bg-blue-600" },
};

export default function HeroBanner() {
  const [slides, setSlides] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [typedText, setTypedText] = useState("");
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
      .catch(() => {})
      .finally(() => setLoadingBanners(false));
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
    const timer = setInterval(() => goTo(current + 1), 12000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];
  const title    = isBn ? slide?.titleBn    : slide?.titleEn;
  const subtitle = isBn ? (slide?.subtitleBn ?? slide?.subtitleEn) : (slide?.subtitleEn ?? slide?.subtitleBn);
  const subtitleStyle = slide?.subtitleStyle ?? "static";

  // Typing effect
  useEffect(() => {
    if (subtitleStyle !== "typing" || !subtitle) { setTypedText(subtitle ?? ""); return; }
    setTypedText("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTypedText(subtitle.slice(0, i));
      if (i >= subtitle.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [subtitle, subtitleStyle, current]);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    setTouchStart(null);
  };

  if (!slide && !loadingBanners) return null;

  return (
    <section className="bg-gray-100">
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
                            <button
                              onClick={() => downloadFile(assetUrl(notice.documentUrl!), `notice-${notice.id}.pdf`)}
                              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-0.5"
                            >
                              <FileText size={10} /> {t.home.noticeBoard.downloadDocument}
                            </button>
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
          {loadingBanners ? (
            <div className="relative w-full lg:w-3/4 rounded-2xl overflow-hidden shadow-xl order-first lg:order-last aspect-[4/3] sm:aspect-video bg-slate-200 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-300/60 to-transparent" />
              <div className="absolute bottom-8 left-8 lg:left-10 flex flex-col gap-3">
                <div className="h-6 w-32 rounded-full bg-slate-300" />
                <div className="h-10 w-80 rounded-lg bg-slate-300" />
                <div className="h-4 w-64 rounded bg-slate-300" />
                <div className="flex gap-3 mt-2">
                  <div className="h-10 w-32 rounded-xl bg-slate-300" />
                  <div className="h-10 w-28 rounded-xl bg-slate-300" />
                </div>
              </div>
            </div>
          ) : (
          <div className="relative w-full lg:w-3/4 rounded-2xl overflow-hidden shadow-xl order-first lg:order-last aspect-[4/3] sm:aspect-video cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background image */}
            <div
              className={cn("absolute inset-0 bg-cover bg-center transition-opacity duration-500", animating ? "opacity-0" : "opacity-100")}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

            {/* Content */}
            <div className={cn("relative h-full flex flex-col justify-end px-4 pb-16 pt-4 sm:pb-8 sm:p-8 lg:p-10 transition-opacity duration-400", animating ? "opacity-0" : "opacity-100")}>
              <h1 className="text-lg sm:text-4xl lg:text-5xl font-bold leading-tight mb-1.5 sm:mb-3 max-w-xl drop-shadow-lg text-green-400">
                {title}
              </h1>
              {subtitle && subtitleStyle === "marquee" && (
                <div className="overflow-hidden sm:mb-6 max-w-lg">
                  <p className="whitespace-nowrap text-white text-xs sm:text-base animate-marquee bg-black/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    {subtitle}
                  </p>
                </div>
              )}
              {subtitle && subtitleStyle === "typing" && (
                <p className="inline-block text-white text-xs sm:text-base max-w-lg sm:mb-6 leading-relaxed bg-black/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  {typedText}<span className="animate-pulse">|</span>
                </p>
              )}
              {subtitle && subtitleStyle === "static" && (
                <p className="inline-block text-white text-xs sm:text-base max-w-lg sm:mb-6 leading-relaxed bg-black/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  {subtitle}
                </p>
              )}
              {/* Buttons: hidden on mobile (shown as absolute below), visible on sm+ */}
              <div className="hidden sm:flex items-center gap-3 mt-0">
                <a
                  href={`tel:${s.phone}`}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                >
                  <Phone size={13} /> {s.phone}
                </a>
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500/80 hover:bg-green-500 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <Link
                  href="/book-service"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-white whitespace-nowrap"
                  style={{ background: "#0C2468" }}
                >
                  <CalendarCheck size={13} /> {t.common.bookService}
                </Link>
              </div>
            </div>

            {/* Buttons: mobile only, absolutely pinned to bottom */}
            <div className={cn("sm:hidden absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 px-3 py-2.5 bg-black/40 backdrop-blur-sm transition-opacity duration-400", animating ? "opacity-0" : "opacity-100")}>
              <a
                href={`tel:${s.phone}`}
                className="flex items-center gap-1.5 bg-white/20 border border-white/30 text-white px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap"
              >
                <Phone size={12} /> {isBn ? "কল" : "Call"}
              </a>
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-green-500/80 text-white px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
              <Link
                href="/book-service"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
                style={{ background: "#0C2468" }}
              >
                <CalendarCheck size={12} /> {t.common.bookService}
              </Link>
            </div>

            {/* Prev / Next */}
            <button
              onClick={() => goTo(current - 1)}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white transition-all"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 right-2 flex gap-2 z-20">
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
          )}

        </div>
      </div>
    </section>
  );
}
