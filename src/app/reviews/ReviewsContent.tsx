"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import StarRating from "@/components/ui/StarRating";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/shared/SectionTitle";
import type { Review } from "@/types";

export default function ReviewsContent() {
  const { t, language } = useLanguage();
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const rev = t.reviews;

  useEffect(() => {
    api.get<{ data: Review[] }>("/reviews/approved")
      .then((r) => setReviews(r.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      await api.post("/reviews", {
        customerName: fd.get("customerName") as string,
        rating,
        serviceUsed: fd.get("serviceUsed") ?? undefined,
        commentEn: fd.get("comment") as string,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title={rev.title} subtitle={rev.subtitle} />

      {/* Reviews grid */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          {reviews.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 flex flex-col border-t-4 border-t-primary-600">
                  <StarRating value={r.rating} className="mb-3" />
                  <p className="text-slate-600 text-sm italic flex-1">
                    &ldquo;{(language === "en" ? r.commentEn : r.commentBn) || r.commentEn || r.commentBn}&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="font-semibold text-sm" style={{ color: "#0C2468" }}>{r.customerName}</p>
                    <p className="text-xs text-primary-600">{r.serviceUsed}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Write review form */}
          <div className="mx-auto max-w-xl">
            <SectionTitle title={rev.writeReview} centered={false} />
            {submitted ? (
              <div className="flex items-center gap-3 rounded-xl bg-green-50 p-5">
                <CheckCircle className="text-green-600 shrink-0" />
                <p className="text-green-800 text-sm">{rev.pending}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input label={rev.form.name} name="customerName" required />
                <Input label={rev.form.service} name="serviceUsed" required />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">{rev.form.rating}</label>
                  <StarRating value={rating} interactive onChange={setRating} size={28} />
                </div>
                <Textarea label={rev.form.comment} name="comment" required rows={4} />
                <Button type="submit" size="lg" fullWidth isLoading={submitting}>
                  {rev.form.submit}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
