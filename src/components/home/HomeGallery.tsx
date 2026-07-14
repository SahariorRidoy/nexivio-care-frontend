"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { cn, assetUrl } from "@/lib/utils";
import SectionTitle from "@/components/shared/SectionTitle";
import type { GalleryItem } from "@/types";

const FALLBACK: GalleryItem[] = [
  { id: "1", type: "photo", titleBn: "নার্সিং সেবা", titleEn: "Nursing Service", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=85&auto=format&fit=crop", createdAt: "" },
  { id: "2", type: "photo", titleBn: "কেয়ারগিভার প্রশিক্ষণ", titleEn: "Caregiver Training", url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=85&auto=format&fit=crop", createdAt: "" },
  { id: "3", type: "event", titleBn: "দলীয় কার্যক্রম", titleEn: "Team Activity", url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=85&auto=format&fit=crop", createdAt: "" },
  { id: "4", type: "photo", titleBn: "বেবি কেয়ার", titleEn: "Baby Care", url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=85&auto=format&fit=crop", createdAt: "" },
  { id: "5", type: "photo", titleBn: "এল্ডার কেয়ার", titleEn: "Elder Care", url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=85&auto=format&fit=crop", createdAt: "" },
];

// Grid layout: 5 cells in a bento pattern
// [0] large left  — col 1-2, row 1-2  (tall)
// [1] top-right-1 — col 3,   row 1
// [2] top-right-2 — col 4,   row 1
// [3] bottom-right-1 — col 3, row 2
// [4] bottom-right-2 — col 4, row 2
const GRID_CLASSES = [
  "col-span-2 row-span-2",   // [0] big hero
  "col-span-1 row-span-1",   // [1]
  "col-span-1 row-span-1",   // [2]
  "col-span-1 row-span-1",   // [3]
  "col-span-1 row-span-1",   // [4]
];

export default function HomeGallery() {
  const { language, t } = useLanguage();
  const isBn = language === "bn";
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    api.get<{ data: GalleryItem[] }>("/gallery")
      .then((r) => { if (r.data.length > 0) setItems(r.data); })
      .catch(() => {});
  }, []);

  const display = items.slice(0, 5);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevSlide = useCallback(() =>
    setLightbox((i) => (i !== null ? (i - 1 + display.length) % display.length : null)),
    [display.length]
  );
  const nextSlide = useCallback(() =>
    setLightbox((i) => (i !== null ? (i + 1) % display.length : null)),
    [display.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox, prevSlide, nextSlide]);

  const lightboxItem = lightbox !== null ? display[lightbox] : null;

  return (
    <section className="bg-white py-14">
      <div className="container mx-auto max-w-7xl px-4">

        <SectionTitle title={t.gallery.title} subtitle={t.gallery.subtitle} />

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-120 lg:h-130">
          {display.map((item, idx) => {
            const title = (isBn ? item.titleBn : item.titleEn) ?? "";
            const img = item.thumbnail ?? item.url;
            const isVideo = item.type === "video";

            return (
              <div
                key={item.id}
                onClick={() => setLightbox(idx)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300",
                  GRID_CLASSES[idx]
                )}
              >
                {/* Image / Video thumbnail */}
                {isVideo ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={assetUrl(img)}
                    className="absolute inset-0 h-full w-full object-cover"
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={assetUrl(img)}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

                {/* Video play button */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary-700 shadow-lg">
                      <Play size={22} fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* Title — slides up on hover */}
                {title && (
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/30 to-transparent px-4 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className={cn(
                      "text-white font-semibold line-clamp-2",
                      idx === 0 ? "text-base" : "text-xs"
                    )}>
                      {title}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-7 py-3 rounded-lg transition-colors shadow-md"
          >
            {isBn ? "সব গ্যালারি দেখুন" : "View Full Gallery"}
          </Link>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
          {display.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            {lightboxItem.type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                key={lightboxItem.url}
                src={assetUrl(lightboxItem.url)}
                controls
                autoPlay
                className="max-h-[80vh] w-full rounded-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={assetUrl(lightboxItem.url)}
                alt={(isBn ? lightboxItem.titleBn : lightboxItem.titleEn) ?? ""}
                className="max-h-[80vh] w-full object-contain rounded-lg"
              />
            )}
            {(isBn ? lightboxItem.titleBn : lightboxItem.titleEn) && (
              <p className="text-center text-white/80 text-sm mt-3">
                {isBn ? lightboxItem.titleBn : lightboxItem.titleEn}
              </p>
            )}
            <p className="text-center text-white/40 text-xs mt-1">
              {(lightbox ?? 0) + 1} / {display.length}
            </p>
          </div>
          {display.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
