"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, X, CheckCircle, PenLine, Quote, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  commentBn: string | null;
  commentEn: string | null;
  serviceUsed: string | null;
}

const FALLBACK_REVIEWS: Review[] = [
  { id: "1", customerName: "রোকেয়া আক্তার", rating: 5, commentBn: "তাদের সেবা সত্যিই ভালো। আমার মায়ের জন্য অভিজ্ঞ কেয়ারগিভার পেয়েছিলাম। দারুণ সন্তুষ্ট।", commentEn: "Their service is truly great. Got an experienced caregiver for my mother. Very satisfied.", serviceUsed: "Caregiver Service" },
  { id: "2", customerName: "মো. রফিকুল ইসলাম", rating: 5, commentBn: "নার্সিং সেবা অনেক পেশাদার ছিল। সময়মতো আসা এবং সঠিক যত্ন — সব মিলিয়ে চমৎকার অভিজ্ঞতা।", commentEn: "The nursing service was very professional. On time and proper care — an excellent experience overall.", serviceUsed: "Nursing Service" },
  { id: "3", customerName: "নাফিসা রহমান", rating: 5, commentBn: "বেবি কেয়ার সার্ভিসে খুবই খুশি। ন্যানী আমার শিশুকে খুব যত্ন নেন। ধন্যবাদ Nexivio Care।", commentEn: "Very happy with the baby care service. The nanny takes great care of my child. Thank you Nexivio Care.", serviceUsed: "Baby Care" },
  { id: "4", customerName: "আব্দুল করিম", rating: 5, commentBn: "এল্ডার কেয়ার সেবা নিয়ে অত্যন্ত সন্তুষ্ট। কর্মীরা খুবই যত্নশীল ও পেশাদার।", commentEn: "Extremely satisfied with the elder care service. The staff are very caring and professional.", serviceUsed: "Elder Care" },
];

const AVATAR_GRADIENTS = [
  "from-primary-500 to-primary-700",
  "from-emerald-500 to-teal-700",
  "from-violet-500 to-purple-700",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-blue-700",
  "from-rose-500 to-pink-700",
];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={cn(i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
      ))}
    </div>
  );
}

function InteractiveStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} type="button" onClick={() => onChange(i + 1)}
          onMouseEnter={() => setHovered(i + 1)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110">
          <Star size={28} className={cn("transition-colors", i < (hovered || value) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, language, index }: { review: Review; language: string; index: number }) {
  const comment = language === "en" ? (review.commentEn ?? review.commentBn) : (review.commentBn ?? review.commentEn);
  const gradientClass = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Top accent */}
      <div className="h-1 w-full bg-linear-to-r from-primary-500 via-emerald-400 to-primary-600" />

      <div className="flex flex-1 flex-col p-6">
        {/* Quote + Stars row */}
        <div className="flex items-start justify-between mb-4">
          <Quote size={36} className="text-primary-100 rotate-180 -mt-1 shrink-0" fill="currentColor" strokeWidth={0} />
          <StarRow rating={review.rating} size={14} />
        </div>

        {/* Comment */}
        <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4 mb-5">
          &ldquo;{comment}&rdquo;
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Author row */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-white text-sm font-bold shadow-sm",
            gradientClass
          )}>
            {getInitials(review.customerName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{review.customerName}</p>
            {review.serviceUsed && (
              <p className="text-xs text-primary-600 font-medium truncate">{review.serviceUsed}</p>
            )}
          </div>
          {review.rating === 5 && (
            <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <ThumbsUp size={10} />
              {language === "en" ? "Verified" : "যাচাই"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ onClose, language, t, apiUrl }: {
  onClose: () => void;
  language: string;
  t: { reviews: { form: { name: string; rating: string; service: string; comment: string; submit: string }; pending: string } };
  apiUrl: string;
}) {
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rev = t.reviews;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fd.get("customerName"),
          rating,
          serviceUsed: fd.get("serviceUsed"),
          commentEn: language === "en" ? fd.get("comment") : null,
          commentBn: language === "bn" ? fd.get("comment") : null,
        }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={overlayRef} onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal header gradient bar */}
        <div className="h-1 w-full bg-linear-to-r from-primary-500 via-emerald-400 to-primary-600" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
              <PenLine size={14} className="text-primary-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">
              {language === "en" ? "Share Your Experience" : "আপনার অভিজ্ঞতা শেয়ার করুন"}
            </h3>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle size={36} className="text-emerald-500" />
              </div>
              <p className="font-semibold text-gray-800">{language === "en" ? "Thank you!" : "ধন্যবাদ!"}</p>
              <p className="text-sm text-gray-500">{rev.pending}</p>
              <button onClick={onClose} className="mt-2 px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
                {language === "en" ? "Close" : "বন্ধ করুন"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{rev.form.name} *</label>
                <input name="customerName" required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                  placeholder={language === "en" ? "Your full name" : "আপনার পূর্ণ নাম"} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{rev.form.service}</label>
                <input name="serviceUsed"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                  placeholder={language === "en" ? "e.g. Nursing Service" : "যেমন: নার্সিং সেবা"} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{rev.form.rating}</label>
                <InteractiveStars value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{rev.form.comment} *</label>
                <textarea name="comment" required rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none transition-all"
                  placeholder={language === "en" ? "Share your experience..." : "আপনার অভিজ্ঞতা শেয়ার করুন..."} />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors shadow-sm">
                {submitting ? (language === "en" ? "Submitting..." : "জমা হচ্ছে...") : rev.form.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const CARDS_PER_PAGE = 3;

export default function HomeBottomSection() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { language, t } = useLanguage();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

  useEffect(() => {
    fetch(`${apiUrl}/reviews/approved`)
      .then((r) => r.json())
      .then((json) => {
        const items: Review[] = json?.data ?? [];
        if (items.length > 0) setReviews(items);
      })
      .catch(() => {});
  }, [apiUrl]);

  const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
  const visibleReviews = reviews.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  const prev = () => setPage((i) => (i - 1 + totalPages) % totalPages);
  const next = () => setPage((i) => (i + 1) % totalPages);

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 py-20">
        {/* Subtle background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-4">

          {/* Section header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t.home.testimonials.title}</h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-linear-to-r from-primary-500 to-emerald-400" />
            </div>
            <button onClick={() => setShowModal(true)}
              className="shrink-0 flex items-center gap-2 rounded-xl border border-primary-600 bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 hover:border-primary-700 active:scale-95 transition-all">
              <PenLine size={14} />
              {language === "en" ? "Write a Review" : "রিভিউ দিন"}
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleReviews.map((review, idx) => (
              <ReviewCard
                key={`${page}-${idx}`}
                review={review}
                language={language}
                index={page * CARDS_PER_PAGE + idx}
              />
            ))}
          </div>

          {/* Navigation + View all */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={prev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-all active:scale-95">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      className={cn("rounded-full transition-all duration-300",
                        i === page ? "h-2.5 w-8 bg-primary-600" : "h-2 w-2 bg-gray-300 hover:bg-gray-400"
                      )} />
                  ))}
                </div>
                <button onClick={next}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-all active:scale-95">
                  <ChevronRight size={18} />
                </button>
              </div>
              <Link href="/reviews"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 active:scale-95 transition-all group">
                {language === "en" ? "View all reviews" : "সকল রিভিউ দেখুন"}
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </section>

      {showModal && (
        <ReviewModal
          onClose={() => setShowModal(false)}
          language={language}
          t={t}
          apiUrl={apiUrl}
        />
      )}
    </>
  );
}
