"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import ServicePackageCards, { slugColor } from "@/components/shared/ServicePackageCards";
import type { Service } from "@/types";

const PRIMARY = "#0C2468";
const WHATSAPP_NUMBER = "8801XXXXXXXXX"; // replace with real number

const STATIC_SERVICE_DATA: Record<string, {
  nameEn: string; nameBn: string;
  shortDescEn: string; shortDescBn: string;
  descriptionEn: string; descriptionBn: string;
  image: string;
}> = {
  "physiotherapy-rehabilitation": {
    nameEn: "Physiotherapy & Rehabilitation Services",
    nameBn: "ফিজিওথেরাপি ও পুনর্বাসন সেবা",
    shortDescEn: "Professional physiotherapy and rehabilitation care at home by certified therapists.",
    shortDescBn: "সার্টিফাইড থেরাপিস্টদের দ্বারা বাড়িতে পেশাদার ফিজিওথেরাপি ও পুনর্বাসন সেবা।",
    descriptionEn: `Nexivio Care provides professional physiotherapy and rehabilitation services in the comfort of your home. Our certified physiotherapists design personalized treatment plans to help patients recover from injuries, surgeries, strokes, and chronic conditions.

Our services include:
• Post-surgical rehabilitation
• Stroke and neurological rehabilitation
• Orthopedic physiotherapy (joint pain, fractures, arthritis)
• Sports injury recovery
• Geriatric physiotherapy for elderly patients
• Respiratory physiotherapy
• Pain management therapy

All sessions are conducted by licensed therapists using evidence-based techniques. We bring the equipment to your home so you can recover safely and comfortably without the hassle of traveling to a clinic.`,
    descriptionBn: `নেক্সিভিও কেয়ার আপনার বাড়িতে পেশাদার ফিজিওথেরাপি ও পুনর্বাসন সেবা প্রদান করে। আমাদের সার্টিফাইড ফিজিওথেরাপিস্টরা আঘাত, অস্ত্রোপচার, স্ট্রোক এবং দীর্ঘস্থায়ী রোগ থেকে সুস্থ হতে ব্যক্তিগতকৃত চিকিৎসা পরিকল্পনা তৈরি করেন।

আমাদের সেবাসমূহ:
• অস্ত্রোপচার পরবর্তী পুনর্বাসন
• স্ট্রোক ও নিউরোলজিক্যাল পুনর্বাসন
• অর্থোপেডিক ফিজিওথেরাপি (জয়েন্ট ব্যথা, ফ্র্যাকচার, আর্থ্রাইটিস)
• স্পোর্টস ইনজুরি রিকভারি
• বয়স্কদের জন্য জেরিয়াট্রিক ফিজিওথেরাপি
• রেসপিরেটরি ফিজিওথেরাপি
• ব্যথা ব্যবস্থাপনা থেরাপি

সকল সেশন লাইসেন্সপ্রাপ্ত থেরাপিস্টদের দ্বারা পরিচালিত হয়। আমরা সরঞ্জাম আপনার বাড়িতে নিয়ে আসি যাতে আপনি ক্লিনিকে যাওয়ার ঝামেলা ছাড়াই নিরাপদে সুস্থ হতে পারেন।`,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
  },
  "on-demand-nursing": {
    nameEn: "On-Demand Nursing",
    nameBn: "অন-ডিমান্ড নার্সিং",
    shortDescEn: "Flexible, on-demand nursing services available whenever you need them.",
    shortDescBn: "যখন প্রয়োজন তখনই পাওয়া যায় এমন নমনীয় অন-ডিমান্ড নার্সিং সেবা।",
    descriptionEn: `Nexivio Care's On-Demand Nursing service gives you access to a qualified nurse exactly when you need one — no long-term commitment required. Whether it's a one-time visit or short-term care, we dispatch trained nurses to your home within hours.

What we offer:
• Wound dressing and injection administration
• IV drip and catheter care
• Post-operative nursing care
• Vital signs monitoring (blood pressure, sugar, oxygen)
• Medication administration and management
• Emergency home nursing visits
• Night duty nursing on request

All our nurses are registered, background-verified, and trained in home-based care protocols. Simply call or message us and we will arrange a nurse at your convenience.`,
    descriptionBn: `নেক্সিভিও কেয়ারের অন-ডিমান্ড নার্সিং সেবা আপনাকে ঠিক যখন প্রয়োজন তখনই একজন যোগ্য নার্সের সুবিধা দেয় — কোনো দীর্ঘমেয়াদী চুক্তির প্রয়োজন নেই। এককালীন ভিজিট বা স্বল্পমেয়াদী সেবা যাই হোক, আমরা কয়েক ঘণ্টার মধ্যে প্রশিক্ষিত নার্স পাঠাই।

আমরা যা অফার করি:
• ক্ষত ড্রেসিং ও ইনজেকশন প্রদান
• আইভি ড্রিপ ও ক্যাথেটার যত্ন
• অস্ত্রোপচার পরবর্তী নার্সিং সেবা
• ভাইটাল সাইন মনিটরিং (রক্তচাপ, সুগার, অক্সিজেন)
• ওষুধ প্রদান ও ব্যবস্থাপনা
• জরুরি হোম নার্সিং ভিজিট
• অনুরোধে নাইট ডিউটি নার্সিং

আমাদের সকল নার্স নিবন্ধিত, পটভূমি-যাচাইকৃত এবং হোম-বেসড কেয়ার প্রোটোকলে প্রশিক্ষিত। শুধু কল করুন বা মেসেজ করুন এবং আমরা আপনার সুবিধামতো একজন নার্সের ব্যবস্থা করব।`,
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop",
  },
  "home-diagnostics": {
    nameEn: "Home Diagnostics",
    nameBn: "হোম ডায়াগনস্টিক্স",
    shortDescEn: "Lab tests and diagnostic services conducted at the comfort of your home.",
    shortDescBn: "আপনার বাড়িতে বসেই ল্যাব টেস্ট ও ডায়াগনস্টিক সেবা গ্রহণ করুন।",
    descriptionEn: `Nexivio Care brings certified diagnostic and laboratory services directly to your doorstep. No more waiting in long queues at diagnostic centers — our trained phlebotomists and technicians collect samples at your home and deliver accurate results promptly.

Available tests include:
• Complete Blood Count (CBC)
• Blood glucose and HbA1c
• Lipid profile and liver function tests
• Thyroid function tests (TSH, T3, T4)
• Urine routine and culture
• ECG at home
• Blood pressure and oxygen saturation monitoring
• COVID-19 and other rapid tests
• Customized health screening packages

All samples are processed in accredited laboratories. Reports are delivered digitally and our team is available to help you understand your results.`,
    descriptionBn: `নেক্সিভিও কেয়ার সার্টিফাইড ডায়াগনস্টিক ও ল্যাবরেটরি সেবা সরাসরি আপনার দরজায় নিয়ে আসে। ডায়াগনস্টিক সেন্টারে দীর্ঘ লাইনে অপেক্ষা করার দরকার নেই — আমাদের প্রশিক্ষিত ফ্লেবোটমিস্ট ও টেকনিশিয়ানরা আপনার বাড়িতে নমুনা সংগ্রহ করেন এবং দ্রুত সঠিক ফলাফল প্রদান করেন।

পাওয়া যায় এমন পরীক্ষাসমূহ:
• কমপ্লিট ব্লাড কাউন্ট (CBC)
• ব্লাড গ্লুকোজ ও HbA1c
• লিপিড প্রোফাইল ও লিভার ফাংশন টেস্ট
• থাইরয়েড ফাংশন টেস্ট (TSH, T3, T4)
• ইউরিন রুটিন ও কালচার
• বাড়িতে ECG
• রক্তচাপ ও অক্সিজেন স্যাচুরেশন মনিটরিং
• COVID-19 ও অন্যান্য র‍্যাপিড টেস্ট
• কাস্টমাইজড হেলথ স্ক্রিনিং প্যাকেজ

সকল নমুনা স্বীকৃত ল্যাবরেটরিতে প্রক্রিয়া করা হয়। রিপোর্ট ডিজিটালি প্রদান করা হয় এবং আমাদের টিম আপনাকে ফলাফল বুঝতে সাহায্য করতে প্রস্তুত।`,
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format&fit=crop",
  },
};

const STATIC_SLUGS = new Set(Object.keys(STATIC_SERVICE_DATA));

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
      .then((r) => setAllServices(r.data.filter((s) => s.isActive && s.slug !== slug).slice(0, 3)))
      .catch(() => {});
  }, [slug]);

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>;

  // If DB has data for this slug, use it (even for previously-static slugs)
  const isStatic = STATIC_SLUGS.has(slug) && !service;
  const staticData = STATIC_SERVICE_DATA[slug];

  const color = slugColor(slug);
  const title = isStatic
    ? (language === "en" ? staticData.nameEn : staticData.nameBn)
    : service
      ? (language === "en" ? service.nameEn : service.nameBn)
      : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const subtitle = isStatic
    ? (language === "en" ? staticData.shortDescEn : staticData.shortDescBn)
    : (language === "en" ? service?.shortDescEn : service?.shortDescBn) ?? "";
  const description = isStatic
    ? (language === "en" ? staticData.descriptionEn : staticData.descriptionBn)
    : (language === "en" ? service?.descriptionEn : service?.descriptionBn) ?? "";
  const image = isStatic ? staticData.image : service?.image ?? "";
  const packages = isStatic ? [] : (service?.packages ?? []);
  const features = isStatic ? [] : (language === "en" ? service?.featuresEn ?? [] : service?.featuresBn ?? []);
  const hasPackages = packages.length > 0;

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} bgImage={image || undefined} bgColor={color} />
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col gap-14">

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {image && (
              <div className="relative w-full lg:w-96 h-64 rounded-2xl overflow-hidden shrink-0 shadow">
                <Image src={image} alt={title} fill className="object-cover" />
              </div>
            )}
            {description && (
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>
                  {language === "en" ? "About This Service" : "এই সেবা সম্পর্কে"}
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-justify">{description}</p>

                {isStatic && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/book-service?service=${slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#16a34a" }}
                    >
                      {language === "en" ? "Get Now" : "এখনই নিন"}
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      <Phone size={16} />
                      {language === "en" ? "Contact Us for This Service" : "এই সেবার জন্য যোগাযোগ করুন"}
                    </Link>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageCircle size={16} />
                      {language === "en" ? "WhatsApp Us" : "হোয়াটসঅ্যাপ করুন"}
                    </a>
                  </div>
                )}

                {!isStatic && !hasPackages && features.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-base font-bold mb-2 pb-1 border-b-2" style={{ color: PRIMARY, borderColor: PRIMARY }}>
                      {language === "en" ? "Our services include:" : "আমাদের সেবাসমূহ:"}
                    </h3>
                    <ul className="mt-2 flex flex-col gap-2">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-semibold">
                          <span className="mt-1.5 shrink-0">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!isStatic && !hasPackages && (() => {
                  const lines = description.split("\n");
                  const lastBulletIdx = lines.map((l, i) => l.trim().startsWith("•") ? i : -1).filter(i => i !== -1).pop() ?? -1;
                  const bottomText = lastBulletIdx !== -1 ? lines.slice(lastBulletIdx + 1).join("\n").trim() : "";
                  if (bottomText) return null;
                  const fallback = language === "en"
                    ? "Our team is available to assist you. Contact us to learn more or book this service today."
                    : "আমাদের টিম আপনাকে সহায়তা করতে প্রস্তুত। আজই যোগাযোগ করুন বা এই সেবাটি বুক করুন।";
                  return <p className="mt-4 text-slate-600 leading-relaxed text-justify">{fallback}</p>;
                })()}
                {!isStatic && !hasPackages && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/book-service?service=${slug}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: "#16a34a" }}>
                      {language === "en" ? "Get Now" : "এখনই নিন"}
                    </Link>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: PRIMARY }}>
                      <Phone size={16} />{language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
                    </Link>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: "#25D366" }}>
                      <MessageCircle size={16} />{language === "en" ? "WhatsApp Us" : "হোয়াটসঅ্যাপ"}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isStatic && hasPackages && <ServicePackageCards slug={slug} packages={packages} featuresEn={service?.featuresEn ?? []} featuresBn={service?.featuresBn ?? []} />}

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
                  ...pkgs.map((p) => p.dutyHours === 24
                    ? (language === "en" ? "Live In" : "লাইভ-ইন")
                    : (language === "en" ? "Day / Night" : "ডে / নাইট")
                  ),
                ]));
                const recItems = Array.from(new Set(pkgs.flatMap((p) => p.includedFeatures)));
                const displayRec = recItems.length > 0
                  ? recItems
                  : (language === "en" ? s.featuresEn : s.featuresBn) ?? [];
                return (
                  <div
                    key={s.id}
                    className="rounded-2xl flex flex-col p-6 gap-5 select-none"
                    style={{ backgroundColor: bg }}
                  >
                    <div>
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
