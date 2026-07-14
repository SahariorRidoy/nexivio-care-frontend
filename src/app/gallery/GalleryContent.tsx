"use client";

import { useEffect, useState, useCallback } from "react";
import { Image as ImageIcon, Video, Calendar, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { cn, assetUrl } from "@/lib/utils";
import type { GalleryItem, GalleryType } from "@/types";

const filterOptions = ["all", "photo", "video", "event"] as const;
type FilterOption = typeof filterOptions[number];

const filterMeta: Record<FilterOption, { labelBn: string; labelEn: string; Icon: React.ElementType }> = {
  all:   { labelBn: "সব",     labelEn: "All",    Icon: ImageIcon },
  photo: { labelBn: "ছবি",    labelEn: "Photos", Icon: ImageIcon },
  video: { labelBn: "ভিডিও", labelEn: "Videos", Icon: Video },
  event: { labelBn: "ইভেন্ট", labelEn: "Events", Icon: Calendar },
};

export default function GalleryContent() {
  const { t, language } = useLanguage();
  const isBn = language === "bn";
  const [filter, setFilter] = useState<FilterOption>("all");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null); // index into filtered array
  const gal = t.gallery;

  useEffect(() => {
    api.get<{ data: GalleryItem[] }>("/gallery")
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  // counts per type for badges
  const counts: Record<string, number> = { all: items.length };
  items.forEach((i) => { counts[i.type] = (counts[i.type] ?? 0) + 1; });

  const openLightbox = (idx: number) => setLightbox(idx);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prevSlide = useCallback(() =>
    setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null)),
    [filtered.length]
  );

  const nextSlide = useCallback(() =>
    setLightbox((i) => (i !== null ? (i + 1) % filtered.length : null)),
    [filtered.length]
  );

  // Keyboard navigation
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

  const lightboxItem = lightbox !== null ? filtered[lightbox] : null;

  return (
    <>
      <PageHeader title={gal.title} subtitle={gal.subtitle} />

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-7xl px-4">

          {/* ── Filter Tabs ── */}
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {filterOptions.map((f) => {
              const { labelBn, labelEn, Icon } = filterMeta[f];
              const count = counts[f] ?? 0;
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                  )}
                >
                  <Icon size={14} />
                  {isBn ? labelBn : labelEn}
                  {count > 0 && (
                    <span className={cn(
                      "text-xs rounded-full px-1.5 py-0.5 font-semibold",
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Loading Skeleton ── */}
          {loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* ── Grid ── */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item, idx) => {
                const title = (isBn ? item.titleBn : item.titleEn) ?? "";
                const img = item.thumbnail ?? item.url;
                const isVideo = item.type === "video";

                return (
                  <div
                    key={item.id}
                    onClick={() => openLightbox(idx)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl bg-slate-100 aspect-square border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    )}
                  >
                    {/* Thumbnail / placeholder */}
                    {img ? (
                      isVideo ? (
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
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary-50">
                        {isVideo
                          ? <Video size={36} className="text-primary-300" />
                          : <ImageIcon size={36} className="text-primary-300" />
                        }
                      </div>
                    )}

                    {/* Video play overlay */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary-700 shadow-lg">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full text-white",
                        item.type === "photo" ? "bg-primary-600" :
                        item.type === "video" ? "bg-red-500" : "bg-amber-500"
                      )}>
                        {isBn ? filterMeta[item.type].labelBn : filterMeta[item.type].labelEn}
                      </span>
                    </div>

                    {/* Title overlay on hover */}
                    {title && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs text-white font-medium line-clamp-2">{title}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <ImageIcon size={40} className="text-slate-200" />
              <p className="text-sm">{gal.noItems}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image / Video */}
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
              {(lightbox ?? 0) + 1} / {filtered.length}
            </p>
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
