"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Stethoscope, Heart, Baby, Users, Activity, Clock, FlaskConical, Plus, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import type { Service } from "@/types";

const STATIC_SERVICES: Service[] = [
  {
    id: "static-1", slug: "physiotherapy-rehabilitation", icon: "Activity", isActive: true, createdAt: "",
    nameEn: "Physiotherapy & Rehabilitation", nameBn: "ফিজিওথেরাপি ও পুনর্বাসন",
    shortDescEn: "Professional physiotherapy and rehabilitation care at home by certified therapists.",
    shortDescBn: "সার্টিফাইড থেরাপিস্টদের দ্বারা বাড়িতে পেশাদার ফিজিওথেরাপি ও পুনর্বাসন সেবা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [],
  },
  {
    id: "static-2", slug: "on-demand-nursing", icon: "Clock", isActive: true, createdAt: "",
    nameEn: "On-Demand Nursing", nameBn: "অন-ডিমান্ড নার্সিং",
    shortDescEn: "Flexible, on-demand nursing services available whenever you need them.",
    shortDescBn: "যখন প্রয়োজন তখনই পাওয়া যায় এমন নমনীয় অন-ডিমান্ড নার্সিং সেবা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [],
  },
  {
    id: "static-3", slug: "home-diagnostics", icon: "FlaskConical", isActive: true, createdAt: "",
    nameEn: "Home Diagnostics", nameBn: "হোম ডায়াগনস্টিক্স",
    shortDescEn: "Lab tests and diagnostic services conducted at the comfort of your home.",
    shortDescBn: "আপনার বাড়িতে বসেই ল্যাব টেস্ট ও ডায়াগনস্টিক সেবা গ্রহণ করুন।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [],
  },
];

const PRIMARY = "#0C2468";

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Heart, Baby, Users, Activity, Clock, FlaskConical, Plus,
};

const FALLBACK_SERVICES: Service[] = [
  {
    id: "f1", slug: "nursing-service", icon: "Stethoscope", isActive: true, createdAt: "",
    nameEn: "Nursing Service", nameBn: "নার্সিং সেবা",
    shortDescEn: "Professional nursing care at home by trained and certified nurses.",
    shortDescBn: "প্রশিক্ষিত ও সার্টিফাইড নার্সদের দ্বারা বাড়িতে পেশাদার নার্সিং সেবা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [],
  },
  {
    id: "f2", slug: "caregiver-service", icon: "Heart", isActive: true, createdAt: "",
    nameEn: "Caregiver Service", nameBn: "কেয়ারগিভার সেবা",
    shortDescEn: "Compassionate caregiver support for patients and elderly at home.",
    shortDescBn: "রোগী ও বয়স্কদের জন্য সহানুভূতিশীল কেয়ারগিভার সহায়তা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [],
  },
  {
    id: "f3", slug: "baby-nanny-care", icon: "Baby", isActive: true, createdAt: "",
    nameEn: "Baby / Nanny Care", nameBn: "বেবি / ন্যানী কেয়ার",
    shortDescEn: "Dedicated baby and nanny care services for your little ones.",
    shortDescBn: "আপনার ছোট্ট সোনামণির জন্য নিবেদিত বেবি ও ন্যানী কেয়ার সেবা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [],
  },
  {
    id: "f4", slug: "elder-care", icon: "Users", isActive: true, createdAt: "",
    nameEn: "Elder Care", nameBn: "এল্ডার কেয়ার",
    shortDescEn: "Respectful and attentive care for your elderly family members.",
    shortDescBn: "আপনার বয়স্ক পরিবারের সদস্যদের জন্য শ্রদ্ধাশীল ও মনোযোগী সেবা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [],
  },
  ...STATIC_SERVICES,
];

export default function MainServicesGrid() {
  const { t, language } = useLanguage();
  const isBn = language === "bn";
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);

  useEffect(() => {
    api.get<{ data: Service[] }>("/services")
      .then((r) => {
        const active = r.data.filter((s) => s.isActive);
        const dynamicSlugs = new Set(active.map((s) => s.slug));
        const merged = [
          ...active,
          ...STATIC_SERVICES.filter((s) => !dynamicSlugs.has(s.slug)),
        ].slice(0, 8);
        if (merged.length > 0) setServices(merged);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto max-w-7xl px-4">

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: PRIMARY }}>
            {t.home.services.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">{t.home.services.subtitle}</p>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary-600" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => {
            const Icon = (s.icon && iconMap[s.icon]) || Plus;
            return (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt={isBn ? s.nameBn : s.nameEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#e8edf7" }}>
                      <Icon size={40} style={{ color: PRIMARY }} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Icon badge */}
                  <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
                    <Icon size={18} style={{ color: PRIMARY }} />
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="text-base sm:text-lg font-bold leading-snug mb-1" style={{ color: PRIMARY }}>
                    {isBn ? s.nameBn : s.nameEn}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed line-clamp-2 flex-1">
                    {isBn ? s.shortDescBn : s.shortDescEn}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-600 group-hover:gap-2 transition-all">
                    {t.common.details} <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}

          {/* View All — fills the last empty slot in the grid */}
          <Link
            href="/services"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-400 transition-all min-h-[200px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-md group-hover:scale-110 transition-transform">
              <ArrowRight size={24} />
            </div>
            <span className="text-base font-bold" style={{ color: PRIMARY }}>{t.common.viewAll}</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
