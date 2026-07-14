"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import type { Service, ServicePackage } from "@/types";

const PRIMARY = "#0C2468";
const TIER_ORDER: ServicePackage["tier"][] = ["basic", "standard", "premium"];

const TIER_CONFIG = {
  basic:    { labelEn: "Basic",    labelBn: "বেসিক",       color: "#64748b", bg: "#f8fafc" },
  standard: { labelEn: "Standard", labelBn: "স্ট্যান্ডার্ড", color: "#2563eb", bg: "#eff6ff" },
  premium:  { labelEn: "Premium",  labelBn: "প্রিমিয়াম",   color: "#d97706", bg: "#fffbeb" },
};

export default function ServiceDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Service }>(`/services/${slug}`)
      .then((r) => setService(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>;

  const title = service ? (language === "en" ? service.nameEn : service.nameBn) : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const subtitle = (language === "en" ? service?.shortDescEn : service?.shortDescBn) ?? "";
  const description = (language === "en" ? service?.descriptionEn : service?.descriptionBn) ?? "";
  const packages = service?.packages ?? [];

  const features = language === "en" ? (service?.featuresEn ?? []) : (service?.featuresBn ?? []);
  // Collect all unique features across all packages (for comparison table)
  const allFeatures = Array.from(new Set(packages.flatMap((p) => p.includedFeatures)));

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col gap-14">

          {/* Service image + description */}
          {(service?.image || description) && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {service?.image && (
                <div className="relative w-full lg:w-80 h-56 rounded-2xl overflow-hidden shrink-0 shadow">
                  <Image src={service.image} alt={title} fill className="object-cover" />
                </div>
              )}
              {description && (
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>
                    {language === "en" ? "About This Service" : "এই সেবা সম্পর্কে"}
                  </h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{description}</p>
                </div>
              )}
            </div>
          )}

          {/* Pricing cards */}
          {packages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-8 text-center" style={{ color: PRIMARY }}>
                {language === "en" ? "Choose Your Package" : "আপনার প্যাকেজ বেছে নিন"}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {TIER_ORDER.map((tier) => {
                  const pkg = packages.find((p) => p.tier === tier);
                  if (!pkg) return null;
                  const cfg = TIER_CONFIG[tier];
                  const isPopular = tier === "standard";
                  return (
                    <div
                      key={tier}
                      className={`relative rounded-2xl border-2 flex flex-col overflow-hidden shadow-sm ${isPopular ? "shadow-lg scale-[1.02]" : ""}`}
                      style={{ borderColor: isPopular ? cfg.color : "#e2e8f0", background: cfg.bg }}
                    >
                      {isPopular && (
                        <div className="text-center text-xs font-bold text-white py-1.5" style={{ backgroundColor: cfg.color }}>
                          {language === "en" ? "⭐ Most Popular" : "⭐ সবচেয়ে জনপ্রিয়"}
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Tier name */}
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: cfg.color }}>
                          {language === "en" ? cfg.labelEn : cfg.labelBn}
                        </p>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                          {language === "en" ? pkg.nameEn : pkg.nameBn}
                        </h3>

                        {/* Duty hours */}
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                          <Clock size={14} />
                          {pkg.dutyHours} {language === "en" ? "hrs / day" : "ঘণ্টা / দিন"}
                        </div>

                        {/* Pricing */}
                        <div className="rounded-xl p-3 mb-5 flex flex-col gap-1.5" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
                          <PriceRow label={language === "en" ? "Daily" : "দৈনিক"} price={pkg.dailyPrice} />
                          <PriceRow label={language === "en" ? "Weekly" : "সাপ্তাহিক"} price={pkg.weeklyPrice} />
                          <PriceRow label={language === "en" ? "Monthly" : "মাসিক"} price={pkg.monthlyPrice} highlight />
                        </div>

                        {/* Features */}
                        <ul className="flex flex-col gap-2 flex-1 mb-6">
                          {pkg.includedFeatures.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: cfg.color }} />
                              {f}
                            </li>
                          ))}
                        </ul>

                        <Link
                          href="/book-service"
                          className="block text-center py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: cfg.color }}
                        >
                          {language === "en" ? "Get Now" : "এখনই নিন"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feature comparison table */}
          {packages.length > 0 && allFeatures.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: PRIMARY }}>
                {language === "en" ? "Feature Comparison" : "ফিচার তুলনা"}
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-slate-600 font-semibold w-1/2">
                        {language === "en" ? "Feature" : "ফিচার"}
                      </th>
                      {TIER_ORDER.map((tier) => {
                        const pkg = packages.find((p) => p.tier === tier);
                        if (!pkg) return null;
                        const cfg = TIER_CONFIG[tier];
                        return (
                          <th key={tier} className="text-center px-4 py-3 font-bold" style={{ color: cfg.color }}>
                            {language === "en" ? cfg.labelEn : cfg.labelBn}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {allFeatures.map((feature, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                        <td className="px-5 py-3 text-slate-700">{feature}</td>
                        {TIER_ORDER.map((tier) => {
                          const pkg = packages.find((p) => p.tier === tier);
                          if (!pkg) return null;
                          const has = pkg.includedFeatures.includes(feature);
                          const cfg = TIER_CONFIG[tier];
                          return (
                            <td key={tier} className="text-center px-4 py-3">
                              {has
                                ? <CheckCircle size={18} className="mx-auto" style={{ color: cfg.color }} />
                                : <XCircle size={18} className="mx-auto text-slate-300" />
                              }
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

function PriceRow({ label, price, highlight }: { label: string; price: number; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${highlight ? "font-bold text-slate-800" : "text-slate-600"}`}>
      <span className="text-xs">{label}</span>
      <span className={highlight ? "text-base" : "text-sm"}>৳{price.toLocaleString()}</span>
    </div>
  );
}
