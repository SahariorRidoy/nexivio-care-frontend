"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Stethoscope, Home, Package, Building2, Ambulance, LifeBuoy, Plus, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import type { OtherService } from "@/types";

const PRIMARY = "#0C2468";
const ACCENT  = "#2563eb";

type CategoryKey = "all" | "doctorConsultation" | "doctorHomeVisit" | "medicalEquipment" | "hospitalVisit" | "ambulance" | "otherSupport";

const CATEGORIES: { key: CategoryKey; labelEn: string; labelBn: string; icon: LucideIcon }[] = [
  { key: "all",                labelEn: "All",                        labelBn: "সব",                          icon: Plus         },
  { key: "doctorConsultation", labelEn: "Doctor Consultation",        labelBn: "ডাক্তার পরামর্শ",             icon: Stethoscope  },
  { key: "doctorHomeVisit",    labelEn: "Doctor Home Visit",          labelBn: "ডাক্তার হোম ভিজিট",           icon: Home         },
  { key: "medicalEquipment",   labelEn: "Medical Equipment",          labelBn: "মেডিকেল সরঞ্জাম",             icon: Package      },
  { key: "hospitalVisit",      labelEn: "Hospital Visit Assistance",  labelBn: "হাসপাতাল ভিজিট সহায়তা",      icon: Building2    },
  { key: "ambulance",          labelEn: "Ambulance Service",          labelBn: "অ্যাম্বুলেন্স সেবা",          icon: Ambulance    },
  { key: "otherSupport",       labelEn: "Other Support Services",     labelBn: "অন্যান্য সহায়তা সেবা",        icon: LifeBuoy     },
];

const CATEGORY_KEYWORDS: Record<Exclude<CategoryKey, "all">, string[]> = {
  doctorConsultation: ["doctor-consult", "consultation", "consult"],
  doctorHomeVisit:    ["doctor-home", "home-visit", "home-doctor"],
  medicalEquipment:   ["equipment", "medical-equipment", "device"],
  hospitalVisit:      ["hospital", "hospital-visit"],
  ambulance:          ["ambulance"],
  otherSupport:       [],
};

function detectCategory(service: OtherService): CategoryKey {
  const haystack = `${service.slug} ${service.nameEn}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Exclude<CategoryKey, "all">, string[]][]) {
    if (keywords.some((kw) => haystack.includes(kw))) return cat;
  }
  return "otherSupport";
}

const FALLBACK_SERVICES: (OtherService & { _category: CategoryKey })[] = [
  {
    id: "1", slug: "doctor-consultation", icon: "Stethoscope", isActive: true, createdAt: "", order: 1,
    nameEn: "Doctor Consultation", nameBn: "ডাক্তার পরামর্শ",
    shortDescEn: "Online and in-person doctor consultation services.", shortDescBn: "অনলাইন ও সরাসরি ডাক্তার পরামর্শ সেবা।",
    descriptionEn: "", descriptionBn: "", featuresEn: [], featuresBn: [],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop",
    packages: [], _category: "doctorConsultation",
  },
  {
    id: "2", slug: "doctor-home-visit", icon: "Home", isActive: true, createdAt: "", order: 2,
    nameEn: "Doctor Home Visit", nameBn: "ডাক্তার হোম ভিজিট",
    shortDescEn: "Qualified doctors visiting your home for check-ups.", shortDescBn: "যোগ্য ডাক্তার আপনার বাড়িতে পরীক্ষার জন্য আসবেন।",
    descriptionEn: "", descriptionBn: "", featuresEn: [], featuresBn: [],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop",
    packages: [], _category: "doctorHomeVisit",
  },
  {
    id: "3", slug: "medical-equipment", icon: "Package", isActive: true, createdAt: "", order: 3,
    nameEn: "Medical Equipment", nameBn: "মেডিকেল সরঞ্জাম",
    shortDescEn: "Rental and supply of home medical equipment.", shortDescBn: "হোম মেডিকেল সরঞ্জাম ভাড়া ও সরবরাহ।",
    descriptionEn: "", descriptionBn: "", featuresEn: [], featuresBn: [],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop",
    packages: [], _category: "medicalEquipment",
  },
  {
    id: "4", slug: "hospital-visit-assistance", icon: "Building2", isActive: true, createdAt: "", order: 4,
    nameEn: "Hospital Visit Assistance", nameBn: "হাসপাতাল ভিজিট সহায়তা",
    shortDescEn: "Assistance and escort for hospital appointments.", shortDescBn: "হাসপাতালের অ্যাপয়েন্টমেন্টে সহায়তা ও সঙ্গ।",
    descriptionEn: "", descriptionBn: "", featuresEn: [], featuresBn: [],
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop",
    packages: [], _category: "hospitalVisit",
  },
  {
    id: "5", slug: "ambulance-service", icon: "Ambulance", isActive: true, createdAt: "", order: 5,
    nameEn: "Ambulance Service", nameBn: "অ্যাম্বুলেন্স সেবা",
    shortDescEn: "24/7 ambulance service for emergencies.", shortDescBn: "জরুরি অবস্থায় ২৪/৭ অ্যাম্বুলেন্স সেবা।",
    descriptionEn: "", descriptionBn: "", featuresEn: [], featuresBn: [],
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop",
    packages: [], _category: "ambulance",
  },
  {
    id: "7", slug: "other-support-services", icon: "LifeBuoy", isActive: true, createdAt: "", order: 7,
    nameEn: "Other Support Services", nameBn: "অন্যান্য সহায়তা সেবা",
    shortDescEn: "Additional support services tailored to your needs.", shortDescBn: "আপনার প্রয়োজন অনুযায়ী অতিরিক্ত সহায়তা সেবা।",
    descriptionEn: "", descriptionBn: "", featuresEn: [], featuresBn: [],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop",
    packages: [], _category: "otherSupport",
  },
];

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Home, Package, Building2, Ambulance, LifeBuoy, Plus,
};

export default function OtherServicesContent() {
  const { language } = useLanguage();
  const [services, setServices] = useState<(OtherService & { _category: CategoryKey })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [headerImage, setHeaderImage] = useState<string | undefined>();

  useEffect(() => {
    api.get<{ data: OtherService[] }>("/other-services")
      .then((r) => {
        const active = r.data.filter((s) => s.isActive);
        // Merge: start with all static fallbacks, override/append dynamic ones
        const dynamicSlugs = new Set(active.map((s) => s.slug));
        const merged = [
          ...FALLBACK_SERVICES.filter((s) => !dynamicSlugs.has(s.slug)),
          ...active.map((s) => ({ ...s, _category: detectCategory(s) })),
        ];
        setServices(merged);
        setHeaderImage(active.find((s) => s.image)?.image);
      })
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "all"
    ? services
    : services.filter((s) => s._category === activeCategory);

  return (
    <>
      <PageHeader
        title={language === "en" ? "Additional Services" : "অতিরিক্ত সেবা"}
        subtitle={language === "en" ? "Additional specialized services by Nexivio Care" : "নেক্সিভিও কেয়ারের বিশেষ অতিরিক্ত সেবাসমূহ"}
        bgImage={headerImage}
      />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                  style={
                    isActive
                      ? { backgroundColor: PRIMARY, color: "#fff", borderColor: PRIMARY }
                      : { backgroundColor: "#fff", color: PRIMARY, borderColor: PRIMARY }
                  }
                >
                  <Icon size={15} />
                  {language === "en" ? cat.labelEn : cat.labelBn}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500 py-10">
              {language === "en" ? "No services found." : "কোনো সেবা পাওয়া যায়নি।"}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => {
                const Icon = (s.icon && iconMap[s.icon]) || Plus;
                return (
                  <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                    {s.image ? (
                      <div className="relative h-48 w-full">
                        <Image src={s.image} alt={language === "en" ? s.nameEn : s.nameBn} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
