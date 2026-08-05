"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Stethoscope, Heart, Baby, Users, Plus, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import type { Service } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Heart, Baby, Users, Plus,
};

const PRIMARY = "#0C2468";
const ACCENT  = "#2563eb";
type CategoryKey = "all" | "nursing" | "caregiver" | "babyCare" | "elderCare" | "others";

const CATEGORIES: { key: CategoryKey; labelEn: string; labelBn: string; icon: LucideIcon }[] = [
  { key: "all",       labelEn: "All Services",       labelBn: "সব সেবা",              icon: Plus        },
  { key: "nursing",   labelEn: "Nursing Service",     labelBn: "নার্সিং সেবা",         icon: Stethoscope },
  { key: "caregiver", labelEn: "Caregiver Service",   labelBn: "কেয়ারগিভার সেবা",     icon: Heart       },
  { key: "babyCare",  labelEn: "Baby / Nanny Care",   labelBn: "বেবি / ন্যানী কেয়ার", icon: Baby        },
  { key: "elderCare", labelEn: "Elder Care",          labelBn: "এল্ডার কেয়ার",        icon: Users       },
  { key: "others",    labelEn: "Other Services",      labelBn: "অন্যান্য সেবা",        icon: Plus        },
];

// Slug keywords to map a service to a category
const CATEGORY_KEYWORDS: Record<Exclude<CategoryKey, "all">, string[]> = {
  nursing:   ["nurs", "nurse"],
  caregiver: ["caregiver", "care-giver", "caretaker"],
  babyCare:  ["baby", "nanny", "infant", "child"],
  elderCare: ["elder", "old", "senior", "aged"],
  others:    [],
};

function detectCategory(service: Service): CategoryKey {
  const haystack = `${service.slug} ${service.nameEn}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Exclude<CategoryKey, "all">, string[]][]) {
    if (keywords.some((kw) => haystack.includes(kw))) return cat;
  }
  return "others";
}

// ─── Fallback static services (shown when API returns nothing) ────────────────
const FALLBACK_SERVICES: (Service & { _category: CategoryKey })[] = [
  {
    id: "1", slug: "nursing-service", icon: "Stethoscope", isActive: true, createdAt: "",
    nameEn: "Nursing Service", nameBn: "নার্সিং সেবা",
    shortDescEn: "Professional nursing care at home by trained nurses.",
    shortDescBn: "প্রশিক্ষিত নার্সদের দ্বারা বাড়িতে পেশাদার নার্সিং সেবা।",
    descriptionEn: "", descriptionBn: "", image: "", packages: [], featuresEn: [], featuresBn: [],
    _category: "nursing",
  },
  {
    id: "2", slug: "caregiver-service", icon: "Heart", isActive: true, createdAt: "",
    nameEn: "Caregiver Service", nameBn: "কেয়ারগিভার সেবা",
    shortDescEn: "Dedicated caregivers for daily personal care and support.",
    shortDescBn: "দৈনন্দিন ব্যক্তিগত যত্ন ও সহায়তার জন্য নিবেদিত কেয়ারগিভার।",
    descriptionEn: "", descriptionBn: "", image: "", packages: [], featuresEn: [], featuresBn: [],
    _category: "caregiver",
  },
  {
    id: "3", slug: "baby-nanny-care", icon: "Baby", isActive: true, createdAt: "",
    nameEn: "Baby / Nanny Care", nameBn: "বেবি / ন্যানী কেয়ার",
    shortDescEn: "Experienced nannies for newborns and young children.",
    shortDescBn: "নবজাতক ও ছোট শিশুদের জন্য অভিজ্ঞ ন্যানী সেবা।",
    descriptionEn: "", descriptionBn: "", image: "", packages: [], featuresEn: [], featuresBn: [],
    _category: "babyCare",
  },
  {
    id: "4", slug: "elder-care", icon: "Users", isActive: true, createdAt: "",
    nameEn: "Elder Care", nameBn: "এল্ডার কেয়ার",
    shortDescEn: "Compassionate care and support for elderly family members.",
    shortDescBn: "বয়স্ক পরিবারের সদস্যদের জন্য সহানুভূতিশীল সেবা।",
    descriptionEn: "", descriptionBn: "", image: "", packages: [], featuresEn: [], featuresBn: [],
    _category: "elderCare",
  },
  {
    id: "5", slug: "other-services", icon: "Plus", isActive: true, createdAt: "",
    nameEn: "Other Services", nameBn: "অন্যান্য সেবা",
    shortDescEn: "Additional home healthcare services tailored to your needs.",
    shortDescBn: "আপনার প্রয়োজন অনুযায়ী অতিরিক্ত হোম হেলথকেয়ার সেবা।",
    descriptionEn: "", descriptionBn: "", image: "", packages: [], featuresEn: [], featuresBn: [],
    _category: "others",
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
        if (active.length === 0) {
          setServices(FALLBACK_SERVICES);
        } else {
          setServices(active.map((s) => ({ ...s, _category: detectCategory(s) })));
          setHeaderImage(active.find((s) => s.image)?.image);
        }
      })
      .catch(() => setServices(FALLBACK_SERVICES))
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
