"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import ServicePackageCards, { slugColor } from "@/components/shared/ServicePackageCards";
import type { OtherService } from "@/types";

const PRIMARY = "#0C2468";

export default function OtherServiceDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const [service, setService] = useState<OtherService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: OtherService }>(`/other-services/${slug}`)
      .then((r) => setService(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
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
    </>
  );
}
