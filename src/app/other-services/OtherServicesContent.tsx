"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus, type LucideIcon, Stethoscope, Heart, Baby, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import type { OtherService } from "@/types";

const PRIMARY = "#0C2468";
const ACCENT  = "#2563eb";

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Heart, Baby, Users, Plus,
};

function DummyCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-slate-200" />
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div className="h-4 w-2/3 bg-slate-200 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-4/5 bg-slate-100 rounded" />
        <div className="mt-auto h-9 w-full bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

export default function OtherServicesContent() {
  const { language } = useLanguage();
  const [services, setServices] = useState<OtherService[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerImage, setHeaderImage] = useState<string | undefined>();

  useEffect(() => {
    api.get<{ data: OtherService[] }>("/other-services")
      .then((r) => {
        const active = r.data.filter((s) => s.isActive);
        setServices(active);
        setHeaderImage(active.find((s) => s.image)?.image);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title={language === "en" ? "Other Services" : "অন্যান্য সেবা"}
        subtitle={language === "en" ? "Additional specialized services by Nexivio Care" : "নেক্সিভিও কেয়ারের বিশেষ অতিরিক্ত সেবাসমূহ"}
        bgImage={headerImage}
      />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : services.length === 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <DummyCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const Icon = (s.icon && iconMap[s.icon]) || Plus;
                return (
                  <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                    {s.image ? (
                      <div className="relative h-48 w-full">
                        <Image src={s.image} alt={language === "en" ? s.nameEn : s.nameBn} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {!s.image && (
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-white" style={{ backgroundColor: PRIMARY }}>
                          <Icon size={26} />
                        </div>
                      )}
                      <h3 className="mb-2 text-lg font-bold" style={{ color: PRIMARY }}>
                        {language === "en" ? s.nameEn : s.nameBn}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed flex-1">
                        {language === "en" ? s.shortDescEn : s.shortDescBn}
                      </p>
                      <Link
                        href={`/other-services/${s.slug}`}
                        className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ backgroundColor: ACCENT }}
                      >
                        {language === "en" ? "View Details" : "বিস্তারিত দেখুন"} <ArrowRight size={14} />
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
