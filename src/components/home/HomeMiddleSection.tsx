"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Phone, MessageCircle, Users, Home, ShieldCheck, BadgeCheck, Zap, HeadphonesIcon, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeMiddleSection() {
  const { t } = useLanguage();
  const why = t.home.whyChoose;
  const how = t.home.howItWorks;
  const sectionRef = useRef<HTMLDivElement>(null);

  const whyItems = [
    { label: why.items.trainedStaff.title,      desc: why.items.trainedStaff.desc,      Icon: BadgeCheck,    color: "bg-blue-500" },
    { label: why.items.verifiedCaregiver.title, desc: why.items.verifiedCaregiver.desc, Icon: ShieldCheck,   color: "bg-green-500" },
    { label: why.items.fastResponse.title,      desc: why.items.fastResponse.desc,      Icon: Zap,           color: "bg-amber-500" },
    { label: why.items.support247.title,        desc: why.items.support247.desc,        Icon: HeadphonesIcon, color: "bg-purple-500" },
  ];

  const steps = [
    { Icon: Phone,         label: how.steps.step1.title, num: "01" },
    { Icon: MessageCircle, label: how.steps.step2.title, num: "02" },
    { Icon: Users,         label: how.steps.step3.title, num: "03" },
    { Icon: Home,          label: how.steps.step4.title, num: "04" },
  ];

  const jobItems = [
    t.services.categories.nursing,
    t.services.categories.caregiver,
    t.services.categories.babyCare,
    t.services.categories.elderCare,
    t.common.experience,
  ];

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">

      {/* ── Parallax Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/Our-Services-Background-Image.webp')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0C2468]/80" />

      <div className="relative container mx-auto max-w-7xl px-4">

        {/* ── Section Title ── */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{why.title}</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-green-400" />
        </div>

        {/* ── Three Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT: Why Choose Us ── */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="text-white font-bold text-xl sm:text-2xl">{why.title}</h3>
              <p className="text-white/60 text-sm mt-1">{why.subtitle}</p>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {whyItems.map(({ label, desc, Icon, color }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${color} shadow-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base sm:text-lg leading-tight">{label}</p>
                    <p className="text-white/60 text-sm mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CENTER: How It Works ── */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 text-center">
              <h3 className="text-white font-bold text-xl sm:text-2xl">{how.title}</h3>
              <p className="text-white/60 text-sm mt-1">{how.subtitle}</p>
            </div>
            <div className="p-6 flex flex-col gap-0">
              {steps.map(({ Icon, label, num }, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  {/* Vertical connector */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-[21px] top-11 w-px h-full bg-white/20" />
                  )}
                  {/* Step circle */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg z-10 ${i % 2 === 0 ? "bg-green-500" : "bg-blue-500"}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="pb-7">
                    <span className="text-white/40 text-xs font-bold tracking-widest">{num}</span>
                    <p className="text-white font-semibold text-base sm:text-lg leading-snug">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Job Application ── */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden flex flex-col">
            {/* Image banner */}
            <div className="relative h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80&auto=format&fit=crop"
                alt="Job opportunity"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2468]/90 via-[#0C2468]/40 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <h3 className="text-white font-bold text-xl sm:text-2xl">{t.jobApplication.title}</h3>
                <p className="text-white/70 text-sm">{t.jobApplication.subtitle}</p>
              </div>
            </div>

            {/* Job list */}
            <div className="p-6 flex flex-col gap-3 flex-1">
              {jobItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 shadow">
                    <Check size={13} strokeWidth={3} className="text-white" />
                  </span>
                  <span className="text-white text-sm sm:text-base font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <Link
                href="/job-application"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-colors shadow-lg"
              >
                {t.common.applyNow} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
