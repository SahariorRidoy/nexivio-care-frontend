"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Clock, BadgeDollarSign, ArrowRight, Monitor, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import type { Training } from "@/types";

const CATEGORIES = [
  { key: "all",          labelEn: "All",                    labelBn: "সব" },
  { key: "caregiver",    labelEn: "Caregiver Training",     labelBn: "কেয়ারগিভার প্রশিক্ষণ" },
  { key: "baby",         labelEn: "Baby Care Training",     labelBn: "বেবি কেয়ার প্রশিক্ষণ" },
  { key: "elder",        labelEn: "Elder Care Training",    labelBn: "এল্ডার কেয়ার প্রশিক্ষণ" },
  { key: "nursing",      labelEn: "Basic Nursing",          labelBn: "বেসিক নার্সিং প্রশিক্ষণ" },
  { key: "homecare",     labelEn: "Home Care Training",     labelBn: "হোম কেয়ার প্রশিক্ষণ" },
  { key: "others",       labelEn: "Other Training",         labelBn: "অন্যান্য প্রশিক্ষণ" },
];

const CLASS_TYPE_LABELS: Record<string, { en: string; bn: string; icon: typeof Monitor }> = {
  online:  { en: "Online",          bn: "অনলাইন",          icon: Monitor },
  offline: { en: "Offline",         bn: "অফলাইন",          icon: MapPin },
  both:    { en: "Online & Offline", bn: "অনলাইন ও অফলাইন", icon: Monitor },
};

function matchCategory(training: Training, key: string): boolean {
  if (key === "all") return true;
  const hay = `${training.titleEn} ${(training as Training & { category?: string }).category ?? ""}`.toLowerCase();
  const map: Record<string, string[]> = {
    caregiver: ["caregiver", "care-giver"],
    baby:      ["baby", "nanny", "infant"],
    elder:     ["elder", "old", "senior"],
    nursing:   ["nurs"],
    homecare:  ["home care", "homecare", "home-care"],
  };
  if (key === "others") {
    return !Object.entries(map).some(([, kws]) => kws.some((kw) => hay.includes(kw)));
  }
  return (map[key] ?? []).some((kw) => hay.includes(kw));
}

const PRIMARY = "#0C2468";

export default function TrainingContent() {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [headerImage, setHeaderImage] = useState<string | undefined>();

  useEffect(() => {
    api.get<{ data: Training[] }>("/training")
      .then((r) => {
        const active = r.data.filter((c) => c.isActive);
        setCourses(active);
        setHeaderImage(active.find((c) => c.image)?.image);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => courses.filter((c) => matchCategory(c, activeCategory)),
    [courses, activeCategory]
  );

  return (
    <>
      <PageHeader title={t.training.title} subtitle={t.training.subtitle} bgImage={headerImage} />
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                  style={isActive
                    ? { backgroundColor: PRIMARY, color: "#fff", borderColor: PRIMARY }
                    : { backgroundColor: "#fff", color: PRIMARY, borderColor: PRIMARY }}
                >
                  {language === "en" ? cat.labelEn : cat.labelBn}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500 py-10">
              {language === "en" ? "No training programs found." : "কোনো প্রশিক্ষণ প্রোগ্রাম পাওয়া যায়নি।"}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => {
                const ct = CLASS_TYPE_LABELS[c.classType] ?? CLASS_TYPE_LABELS.offline;
                const ClassIcon = ct.icon;
                return (
                  <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                    {/* Image */}
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt={language === "en" ? c.titleEn : c.titleBn} className="w-full h-44 object-cover" />
                    ) : (
                      <div className="w-full h-44 flex items-center justify-center bg-primary-50">
                        <BookOpen size={40} className="text-primary-300" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="mb-3 text-lg font-bold" style={{ color: PRIMARY }}>
                        {language === "en" ? c.titleEn : c.titleBn}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {c.duration && (
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Clock size={14} /> {c.duration}
                          </div>
                        )}
                        {c.fee > 0 ? (
                          <div className="flex items-center gap-1 text-sm font-semibold text-primary-700">
                            <BadgeDollarSign size={14} /> ৳{c.fee.toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            {language === "en" ? "Contact for fee" : "ফি জানতে যোগাযোগ করুন"}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <ClassIcon size={13} />
                          {language === "en" ? ct.en : ct.bn}
                        </div>
                      </div>
                      <div className="flex-1" />
                      <Link
                        href={`/training/${c.slug}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        {t.common.details} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
