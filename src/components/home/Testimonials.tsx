"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import StarRating from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

const CARDS_PER_PAGE = 3;

const AVATAR_GRADIENTS = [
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-600",
  "from-rose-400 to-pink-600",
  "from-lime-400 to-green-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const { t, language } = useLanguage();
  const [page, setPage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api
      .get<{ data: Review[] }>("/reviews/approved")
      .then((r) => {
        setReviews(r.data);
        setPage(0);
      })
      .catch(() => {});
  }, []);

  const count = reviews.length;
  const totalPages = Math.ceil(count / CARDS_PER_PAGE);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (animating || totalPages <= 1) return;
      setAnimating(true);
      setTimeout(() => {
        setPage((p) => (p + dir + totalPages) % totalPages);
        setAnimating(false);
      }, 300);
    },
    [animating, totalPages]
  );

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => go(1), 5000);
  }, [go]);

  useEffect(() => {
    if (totalPages > 1) startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalPages, startAutoPlay]);

  if (count === 0) return null;

  const visibleReviews = reviews.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  return (
    <section
      className="relative overflow-hidden py-20"
      style={{ background: "linear-gradient(135deg, #0C2468 0%, #0a1e55 50%, #071848 100%)" }}
      onMouseEnter={() => intervalRef.current && clearInterval(intervalRef.current)}
      onMouseLeave={() => totalPages > 1 && startAutoPlay()}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/3 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/2 blur-2xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-300">
            {t.home.testimonials.subtitle}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t.home.testimonials.title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-linear-to-r from-primary-400 to-emerald-400" />
        </div>

        {/* Cards Grid */}
        <div
          className={cn(
            "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300",
            animating ? "opacity-0" : "opacity-100"
          )}
        >
          {visibleReviews.map((review, idx) => {
            const globalIdx = page * CARDS_PER_PAGE + idx;
            const gradientClass = AVATAR_GRADIENTS[globalIdx % AVATAR_GRADIENTS.length];
            const comment =
              (language === "en" ? review.commentEn : review.commentBn) ||
              review.commentEn ||
              review.commentBn;

            return (
              <div
                key={review.id}
                className="relative flex flex-col rounded-2xl bg-white shadow-2xl shadow-black/40"
              >
                <div className="h-1.5 w-full rounded-t-2xl bg-linear-to-r from-primary-400 via-emerald-400 to-primary-500" />

                <div className="flex flex-1 flex-col p-7">
                  <Quote
                    size={32}
                    className="mb-4 rotate-180 text-primary-200"
                    fill="currentColor"
                    strokeWidth={0}
                  />

                  <StarRating value={review.rating} size={18} className="mb-4" />

                  <p className="flex-1 text-sm sm:text-base leading-relaxed text-slate-600 line-clamp-5">
                    &ldquo;{comment}&rdquo;
                  </p>

                  <div className="my-5 h-px bg-slate-100" />

                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-md",
                        gradientClass
                      )}
                    >
                      {getInitials(review.customerName)}
                    </div>
                    <div>
                      <p className="font-semibold text-base text-slate-900">
                        {review.customerName}
                      </p>
                      <p className="text-sm mt-0.5 text-primary-600">
                        {review.serviceUsed}
                      </p>
                    </div>
                    {review.rating === 5 && (
                      <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:border-primary-400 hover:bg-primary-500/20 hover:text-primary-300 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (animating) return;
                    setAnimating(true);
                    setTimeout(() => {
                      setPage(i);
                      setAnimating(false);
                    }, 300);
                  }}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === page
                      ? "h-2.5 w-8 bg-linear-to-r from-primary-400 to-emerald-400"
                      : "h-2 w-2 bg-white/30 hover:bg-white/50"
                  )}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:border-primary-400 hover:bg-primary-500/20 hover:text-primary-300 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <p className="mt-5 text-center text-xs text-white/40">
          {count} reviews
        </p>
      </div>
    </section>
  );
}
