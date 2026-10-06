"use client";

import Link from "next/link";
import { CheckCircle, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { ServicePackage } from "@/types";

const TIER_ORDER: ServicePackage["tier"][] = ["basic", "standard", "premium"];

const SLUG_COLORS: Record<string, string> = {
  "nursing-service":       "#1d4ed8",
  "caregiver-service":     "#0891b2",
  "baby-nanny-care":       "#7c3aed",
  "elder-care":            "#15803d",
  "other-services":        "#0369a1",
  "caregiver-training":    "#6d28d9",
  "baby-care-training":    "#0e7490",
  "elder-care-training":   "#16a34a",
  "basic-nursing-training":"#4f46e5",
  "home-care-training":    "#059669",
  "other-training":        "#2563eb",
};

const FALLBACK_COLORS = ["#1d4ed8", "#0891b2", "#7c3aed", "#15803d", "#0369a1"];

export function slugColor(slug: string): string {
  if (SLUG_COLORS[slug]) return SLUG_COLORS[slug];
  const hash = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

interface Props {
  slug: string;
  packages: ServicePackage[];
  featuresEn?: string[];
  featuresBn?: string[];
}

export default function ServicePackageCards({ slug, packages, featuresEn = [], featuresBn = [] }: Props) {
  const { language } = useLanguage();
  const color = slugColor(slug);
  // Build a map from English feature key → display label (BN or EN)
  const featureLabelMap = new Map<string, string>();
  featuresEn.forEach((en, i) => {
    featureLabelMap.set(en, language === "bn" && featuresBn[i] ? featuresBn[i] : en);
  });
  const allFeatures = Array.from(new Set(packages.flatMap((p) => p.includedFeatures)));

  if (packages.length === 0) return null;

  return (
    <div className="flex flex-col gap-14">
      {/* Pricing cards — full-width colored bg */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 py-12 px-4" style={{ backgroundColor: color }}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-xl font-bold mb-8 text-center text-white">
            {language === "en" ? "Choose Your Package" : "আপনার প্যাকেজ বেছে নিন"}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TIER_ORDER.map((tier) => {
              const pkg = packages.find((p) => p.tier === tier);
              if (!pkg) return null;
              const name = language === "en" ? pkg.nameEn : pkg.nameBn;
              return (
                <div
                  key={tier}
                  className="rounded-2xl bg-white flex flex-col overflow-hidden select-none"
                  style={{ border: `2.5px solid ${color}` }}
                >
                  {/* Top: big package name */}
                  <div className="px-6 pt-6 pb-3 flex flex-col items-center gap-3">
                    <p className="text-4xl font-black tracking-tight text-center leading-none" style={{ color }}>
                      {name}
                    </p>
                    {(language === "bn" ? pkg.descriptionBn : pkg.descriptionEn) && (
                      <p className="text-xs text-center text-slate-500 leading-relaxed px-1">
                        {language === "bn" ? pkg.descriptionBn : pkg.descriptionEn}
                      </p>
                    )}
                    <span
                      className="text-xs font-bold uppercase tracking-widest text-white px-4 py-1 rounded-full"
                      style={{ backgroundColor: color }}
                    >
                      {name}
                    </span>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ borderColor: color, color }}>
                        {pkg.dutyHours} {language === "en" ? "Hours" : "ঘণ্টা"}
                      </span>
                    </div>
                  </div>

                  {/* Features box */}
                  <div className="mx-4 mb-4 rounded-xl bg-slate-100 p-4 flex-1">
                    <ul className="flex flex-col gap-2">
                      {allFeatures.map((f, i) => {
                        const included = pkg.includedFeatures.includes(f);
                        return (
                          <li key={i} className={`flex items-start gap-2 text-sm ${included ? "text-slate-800 font-semibold" : "text-slate-400"}`}>
                            {included
                              ? <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
                              : <span className="shrink-0 mt-0.5 w-4 h-4" />
                            }
                            {featureLabelMap.get(f) ?? f}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Price box */}
                  <div className="mx-4 mb-4 rounded-xl border bg-white p-4 text-center" style={{ borderColor: "#e2e8f0" }}>
                    <p className="text-xs text-slate-500 mb-1">{language === "en" ? "Starts from" : "শুরু হয়"}</p>
                    <p className="text-3xl font-black" style={{ color }}>
                      ৳ {pkg.monthlyPrice.toLocaleString()}
                      <span className="text-sm font-semibold text-slate-500">/{language === "en" ? "Month*" : "মাস*"}</span>
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-5">
                    <Link
                      href={`/book-service?service=${slug}`}
                      className="block text-center py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: color }}
                    >
                      {language === "en" ? "Get Now" : "এখনই নিন"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Policy notes */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-amber-600 shrink-0" />
          <h3 className="font-bold text-amber-800 text-base">
            {language === "en" ? "Important Policy Notes" : "গুরুত্বপূর্ণ নীতিমালা"}
          </h3>
        </div>
        <ul className="flex flex-col gap-3 text-sm text-amber-900">
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            {language === "en"
              ? "Service providers are entitled to 2 days off per month."
              : "সেবা প্রদানকারীরা প্রতি মাসে ২ দিন ছুটি পাওয়ার অধিকারী।"}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            {language === "en"
              ? "Replacement during off days is available upon request and may incur an additional charge."
              : "ছুটির দিনে অনুরোধের ভিত্তিতে বিকল্প সেবা প্রদানকারী পাওয়া যাবে, তবে অতিরিক্ত চার্জ প্রযোজ্য হতে পারে।"}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            {language === "en"
              ? "Clients must provide at least one meal per day. If not provided, BDT 3,000/month meal allowance will apply. For 24-hour duty, meals are mandatory."
              : "ক্লায়েন্টদের প্রতিদিন কমপক্ষে একটি খাবার সরবরাহ করতে হবে। না দিলে মাসিক ৳৩,০০০ মিল অ্যালাউন্স যোগ হবে। ২৪ ঘণ্টার ডিউটিতে খাবার সরবরাহ বাধ্যতামূলক।"}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            {language === "en"
              ? "Additional service hours or special requirements will incur applicable extra charges."
              : "অতিরিক্ত সেবার সময় বা বিশেষ চাহিদার জন্য প্রযোজ্য অতিরিক্ত চার্জ প্রযোজ্য হবে।"}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            {language === "en"
              ? "Timely payment and prior notice are required for service continuation, cancellation, or rescheduling."
              : "সেবা চালিয়ে যাওয়া, বাতিল বা পুনর্নির্ধারণের জন্য সময়মতো পেমেন্ট এবং আগাম নোটিশ প্রয়োজন।"}
          </li>
        </ul>
      </div>
    </div>
  );
}
