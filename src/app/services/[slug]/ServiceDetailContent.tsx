"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import ServicePackageCards, { slugColor } from "@/components/shared/ServicePackageCards";
import type { Service } from "@/types";

const PRIMARY = "#0C2468";

export default function ServiceDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Service }>(`/services/${slug}`)
      .then((r) => setService(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    api.get<{ data: Service[] }>("/services")
      .then((r) => setAllServices(r.data.filter((s) => s.isActive && s.slug !== slug)))
      .catch(() => {});
  }, [slug]);

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>;

  const color = slugColor(slug);
  const title = service
    ? (language === "en" ? service.nameEn : service.nameBn)
    : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const subtitle = (language === "en" ? service?.shortDescEn : service?.shortDescBn) ?? "";
  const description = (language === "en" ? service?.descriptionEn : service?.descriptionBn) ?? "";
  const packages = service?.packages ?? [];

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} bgColor={color} />
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col gap-14">

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

          <ServicePackageCards slug={slug} packages={packages} />

        </div>
      </section>

      {/* Explore Other Services */}
      {allServices.length > 0 && (
        <section className="py-16 relative overflow-hidden">
          {/* Background image with parallax */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/Our-Services-Background-Image.webp')",
              backgroundAttachment: "fixed",
            }}
          />
          {/* Color overlay at 20% opacity */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color }} />

          <div className="relative container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-black text-white text-center mb-10">
              {language === "en" ? "Explore Our Other Services" : "আমাদের অন্যান্য সেবা দেখুন"}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allServices.map((s) => {
                const bg = slugColor(s.slug);
                const name = language === "en" ? s.nameEn : s.nameBn;
                const pkgs = s.packages ?? [];
                const pills = Array.from(new Set([
                  ...pkgs.map((p) => `${p.dutyHours} ${language === "en" ? "Hrs" : "ঘণ্টা"}`),
                  ...pkgs.map((p) => language === "en" ? p.nameEn : p.nameBn),
                ]));
                const recItems = Array.from(new Set(pkgs.flatMap((p) => p.includedFeatures)));
                const displayRec = recItems.length > 0
                  ? recItems
                  : (language === "en" ? s.featuresEn : s.featuresBn) ?? [];
                return (
                  <div
                    key={s.id}
                    className="rounded-2xl flex flex-col p-6 gap-5"
                    style={{ backgroundColor: bg }}
                  >
                    <div>
                      <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
                        {language === "en" ? "Nexivio Care" : "নেক্সিভিও কেয়ার"}
                      </p>
                      <h3 className="text-3xl font-black text-white leading-tight">{name}</h3>
                    </div>

                    {pills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {pills.map((pill, i) => (
                          <span key={i} className="text-xs font-semibold text-white px-3 py-1 rounded-full border border-white/50">
                            {pill}
                          </span>
                        ))}
                      </div>
                    )}

                    {displayRec.length > 0 && (
                      <div>
                        <div
                          className="inline-block px-4 py-1.5 rounded-lg text-sm font-bold text-white mb-3"
                          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                        >
                          {language === "en" ? "Recommended for" : "যাদের জন্য প্রযোজ্য"}
                        </div>
                        <ul className="flex flex-col gap-1.5">
                          {displayRec.slice(0, 7).map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                              <ChevronRight size={14} className="shrink-0 mt-0.5 text-white/50" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto pt-2">
                      <Link
                        href={`/services/${s.slug}`}
                        className="inline-block px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-wide transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#f5c518", color: "#1a1a1a" }}
                      >
                        {language === "en" ? "View More" : "আরও দেখুন"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
