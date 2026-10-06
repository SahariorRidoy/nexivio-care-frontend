"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Stethoscope, Heart, Baby, Users, Plus, Activity, Clock, FlaskConical, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import type { Service } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Heart, Baby, Users, Plus, Activity, Clock, FlaskConical,
};

const PRIMARY = "#0C2468";
const ACCENT  = "#2563eb";
type CategoryKey = "all" | "nursing" | "caregiver" | "babyCare" | "elderCare" | "physiotherapy" | "onDemandNursing" | "homeDiagnostics" | "others";

const CATEGORIES: { key: CategoryKey; labelEn: string; labelBn: string; icon: LucideIcon }[] = [
  { key: "all",             labelEn: "All Services",                    labelBn: "সব সেবা",                        icon: Plus         },
  { key: "nursing",         labelEn: "Nursing Service",                 labelBn: "নার্সিং সেবা",                   icon: Stethoscope  },
  { key: "caregiver",       labelEn: "Caregiver Service",               labelBn: "কেয়ারগিভার সেবা",               icon: Heart        },
  { key: "babyCare",        labelEn: "Baby / Nanny Care",               labelBn: "বেবি / ন্যানী কেয়ার",           icon: Baby         },
  { key: "elderCare",       labelEn: "Elder Care",                      labelBn: "এল্ডার কেয়ার",                  icon: Users        },
  { key: "physiotherapy",   labelEn: "Physiotherapy & Rehabilitation",  labelBn: "ফিজিওথেরাপি ও পুনর্বাসন",       icon: Activity     },
  { key: "onDemandNursing", labelEn: "On-Demand Nursing",               labelBn: "অন-ডিমান্ড নার্সিং",            icon: Clock        },
  { key: "homeDiagnostics", labelEn: "Home Diagnostics",                labelBn: "হোম ডায়াগনস্টিক্স",             icon: FlaskConical },
  
];

// Slug keywords to map a service to a category
const CATEGORY_KEYWORDS: Record<Exclude<CategoryKey, "all">, string[]> = {
  nursing:         ["nurs", "nurse"],
  caregiver:       ["caregiver", "care-giver", "caretaker"],
  babyCare:        ["baby", "nanny", "infant", "child"],
  elderCare:       ["elder", "old", "senior", "aged"],
  physiotherapy:   ["physio", "rehabilitation", "rehab"],
  onDemandNursing: ["on-demand", "ondemand"],
  homeDiagnostics: ["diagnostic", "lab", "test"],
  others:          [],
};

const CATEGORY_MAP: Record<string, CategoryKey> = {
  caregiver:  "caregiver",
  nursing:    "nursing",
  "elder-care": "elderCare",
  "nanny-care":  "babyCare",
};

function detectCategory(service: Service): CategoryKey {
  if (service.category && CATEGORY_MAP[service.category]) return CATEGORY_MAP[service.category];
  // fallback: slug keyword matching for legacy data
  const haystack = `${service.slug} ${service.nameEn}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Exclude<CategoryKey, "all">, string[]][]) {
    if (keywords.some((kw) => haystack.includes(kw))) return cat;
  }
  return "others";
}

// ─── Static services always shown after dynamic API data ─────────────────────
const STATIC_SERVICES: (Service & { _category: CategoryKey })[] = [
  {
    id: "static-1", slug: "physiotherapy-rehabilitation", icon: "Activity", isActive: true, createdAt: "",
    nameEn: "Physiotherapy & Rehabilitation Services", nameBn: "ফিজিওথেরাপি ও পুনর্বাসন সেবা",
    shortDescEn: "Professional physiotherapy and rehabilitation care at home by certified therapists.",
    shortDescBn: "সার্টিফাইড থেরাপিস্টদের দ্বারা বাড়িতে পেশাদার ফিজিওথেরাপি ও পুনর্বাসন সেবা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [], _category: "physiotherapy",
  },
  {
    id: "static-2", slug: "on-demand-nursing", icon: "Clock", isActive: true, createdAt: "",
    nameEn: "On-Demand Nursing", nameBn: "অন-ডিমান্ড নার্সিং",
    shortDescEn: "Flexible, on-demand nursing services available whenever you need them.",
    shortDescBn: "যখন প্রয়োজন তখনই পাওয়া যায় এমন নমনীয় অন-ডিমান্ড নার্সিং সেবা।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [], _category: "onDemandNursing",
  },
  {
    id: "static-3", slug: "home-diagnostics", icon: "FlaskConical", isActive: true, createdAt: "",
    nameEn: "Home Diagnostics", nameBn: "হোম ডায়াগনস্টিক্স",
    shortDescEn: "Lab tests and diagnostic services conducted at the comfort of your home.",
    shortDescBn: "আপনার বাড়িতে বসেই ল্যাব টেস্ট ও ডায়াগনস্টিক সেবা গ্রহণ করুন।",
    descriptionEn: "", descriptionBn: "",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop",
    packages: [], featuresEn: [], featuresBn: [], _category: "homeDiagnostics",
  },
];

export default function ServicesContent() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<(Service & { _category: CategoryKey })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [headerImage, setHeaderImage] = useState<string | undefined>();

  useEffect(() => {
    api.get<{ data: Service[] }>("/services")
      .then((r) => {
        const active = r.data.filter((s) => s.isActive);
        const dynamicSlugs = new Set(active.map((s) => s.slug));
        const merged = [
          ...active.map((s) => ({ ...s, _category: detectCategory(s) })),
          ...STATIC_SERVICES.filter((s) => !dynamicSlugs.has(s.slug)),
        ];
        setServices(merged);
        setHeaderImage(active.find((s) => s.image)?.image);
      })
      .catch(() => setServices(STATIC_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "all"
    ? services
    : services.filter((s) => s._category === activeCategory);

  return (
    <>
      <PageHeader title={t.services.title} subtitle={t.services.subtitle} bgImage={headerImage} />

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

          {/* Services Grid */}
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
                        <Image
                          src={s.image}
                          alt={language === "en" ? s.nameEn : s.nameBn}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="mb-2 text-lg font-bold" style={{ color: PRIMARY }}>
                        {language === "en" ? s.nameEn : s.nameBn}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed flex-1">
                        {language === "en" ? s.shortDescEn : s.shortDescBn}
                      </p>
                      <Link
                        href={`/services/${s.slug}`}
                        className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#16a34a" }}
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
