"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

type BannerType = 'offer' | 'campaign' | 'training' | 'service';

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
  offer:    { label: 'Running Offer',          className: 'bg-red-500 text-white' },
  campaign: { label: 'Promotional Campaign',   className: 'bg-orange-500 text-white' },
  training: { label: 'Training Announcement',  className: 'bg-blue-600 text-white' },
  service:  { label: 'Care Service Promotion', className: 'bg-green-600 text-white' },
};

// Fallback slides used when no banners are in the DB yet
const FALLBACK_SLIDES: Banner[] = [
  {
    id: "1", titleBn: "আপনার প্রিয়জনের যত্নে আমরা আছি পাশে",
    titleEn: "We Are Here For Your Loved Ones",
    subtitleBn: "সারা বাংলাদেশে বিশ্বস্ত কেয়ারগিভিং, নার্সিং ও বেবি কেয়ার সেবা প্রদান করি",
    subtitleEn: "Trusted caregiving, nursing and baby care services across Bangladesh",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&q=85&auto=format&fit=crop",
    ctaLink: "/book-service", isActive: true, order: 1,
  },
  {
    id: "2", titleBn: "প্রশিক্ষিত ও যাচাইকৃত কেয়ারগিভার",
    titleEn: "Trained & Verified Caregivers",
    subtitleBn: "আমাদের সকল কর্মী পেশাদারভাবে প্রশিক্ষিত এবং যাচাইকৃত",
    subtitleEn: "All our staff are professionally trained and verified",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=85&auto=format&fit=crop",
    ctaLink: "/services", isActive: true, order: 2,
  },
  {
    id: "3", titleBn: "প্রশিক্ষণ কোর্সে ভর্তি চলছে",
    titleEn: "Training Course Enrollment Open",
    subtitleBn: "কেয়ারগিভার, নার্সিং ও বেবি কেয়ার প্রশিক্ষণে যোগ দিন",
    subtitleEn: "Join our caregiver, nursing and baby care training programs",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=700&q=85&auto=format&fit=crop",
    ctaLink: "/training", isActive: true, order: 3,
  },
];

const BG_COLORS = ["#e8f5fc", "#e8f5e9", "#fff8e1", "#f3e5f5", "#fce4ec"];

export default function HeroBanner() {
  const [slides, setSlides] = useState<Banner[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const s = useSettings();
  const { language, t } = useLanguage();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
    fetch(`${apiUrl}/banners`)
      .then((r) => r.json())
      .then((json) => {
        const active: Banner[] = (json?.data ?? []).filter((b: Banner) => b.isActive);
        if (active.length > 0) setSlides(active);
      })
      .catch(() => {}); // silently keep fallback
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
    const t = setInterval(() => goTo(current + 1), 5500);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = slides[current];
  const bg = BG_COLORS[current % BG_COLORS.length];
  const title    = language === "en" ? slide.titleEn    : slide.titleBn;
  const subtitle = language === "en" ? slide.subtitleEn : slide.subtitleBn;

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: bg }}
    >
      <div className="container mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* ── Text side ── */}
          <div className={cn("flex-1 transition-opacity duration-400", animating ? "opacity-0" : "opacity-100")}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-3">
              {slide.titleBn}
            </h1>
            {slide.type && TYPE_BADGES[slide.type] && (
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${TYPE_BADGES[slide.type].className}`}>
                {TYPE_BADGES[slide.type].label}
              </span>
            )}
            {slide.subtitleBn && (
              <p className="text-gray-600 text-base lg:text-lg max-w-lg mb-8 leading-relaxed">
                {slide.subtitleBn}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {/* Call button */}
              <a
                href={`tel:${s.phone}`}
                className="flex items-center gap-3 bg-navy-900 hover:bg-navy-800 text-white pl-4 pr-6 py-3 rounded-lg shadow-md transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 shrink-0">
                  <Phone size={18} />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs text-white/80">{t.header.callUs}</p>
                  <p className="text-base font-bold">{s.phone}</p>
                </div>
              </a>
              {/* WhatsApp button */}
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white pl-4 pr-6 py-3 rounded-lg shadow-md transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs text-white/80">WhatsApp</p>
                  <p className="text-base font-bold">{s.whatsapp}</p>
                </div>
              </a>
              {/* CTA link from banner */}
              {slide.ctaLink && (
                <Link
                  href={slide.ctaLink}
                  className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition-colors"
                >
                  {t.common.bookService}
                </Link>
              )}
            </div>
          </div>

          {/* ── Image side ── */}
          <div className={cn("flex-1 w-full max-w-lg lg:max-w-none transition-opacity duration-400", animating ? "opacity-0" : "opacity-100")}>
            <div className="relative overflow-hidden aspect-4/3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.titleBn}
                className="w-full h-full object-cover rounded-sm"
              />
              <div
                className="absolute inset-0"
               
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all border border-gray-200"
        aria-label="Previous"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>
      {/* Next arrow */}
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all border border-gray-200"
        aria-label="Next"
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === current ? "w-7 bg-primary-700" : "w-2 bg-gray-400/60"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
