"use client";

import Link from "next/link";
import { ArrowRight, Phone, MessageCircle, Users, Home, ShieldCheck, BadgeCheck, Zap, HeadphonesIcon, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeMiddleSection() {
  const { t } = useLanguage();
  const why = t.home.whyChoose;
  const how = t.home.howItWorks;

  const whyItems = [
    { label: why.items.trainedStaff.title,      Icon: BadgeCheck },
    { label: why.items.verifiedCaregiver.title, Icon: ShieldCheck },
    { label: why.items.fastResponse.title,      Icon: Zap },
    { label: why.items.support247.title,        Icon: HeadphonesIcon },
  ];

  const steps = [
    { num: "১", Icon: Phone,         label: how.steps.step1.title },
    { num: "২", Icon: MessageCircle, label: how.steps.step2.title },
    { num: "৩", Icon: Users,         label: how.steps.step3.title },
    { num: "৪", Icon: Home,          label: how.steps.step4.title },
  ];

  const jobItems = [
    t.services.categories.nursing,
    t.services.categories.caregiver,
    t.services.categories.babyCare,
    t.common.experience,
    t.jobApplication.title,
  ];

  return (
    <section className="bg-gray-50 pt-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT: Why Choose Us ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-primary-800 px-5 py-3">
              <h2 className="text-white font-bold text-lg leading-snug">
                {why.title}
              </h2>
            </div>
            <div className="flex gap-3 p-4">
              <div className="shrink-0 w-28 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80&auto=format&fit=crop"
                  alt="Nurse"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="flex flex-col gap-4 flex-1 py-1">
                {whyItems.map(({ label, Icon }, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                      <Icon size={12} strokeWidth={2.5} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── CENTER: How It Works ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="text-center px-5 pt-5 pb-3">
              <h2 className="font-bold text-lg text-gray-800 leading-tight">
                {how.title}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <div className="h-px w-8 bg-gray-300" />
                <svg viewBox="0 0 24 24" width="13" height="13" fill="#4caf50">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
                <div className="h-px w-8 bg-gray-300" />
              </div>
            </div>
            <div className="px-4 pb-6">
              <div className="flex items-start justify-between gap-1">
                {steps.map(({ num, Icon, label }, i) => (
                  <div key={i} className="flex items-start gap-1 flex-1">
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md mb-2 ${i % 2 === 0 ? "bg-primary-700" : "bg-green-600"}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white text-xs font-bold mb-1.5">
                        {num}
                      </div>
                      <p className="text-xs text-gray-600 leading-tight">{label}</p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mt-5 shrink-0 text-gray-400">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Job Section ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-navy-900 px-5 py-3">
              <h2 className="text-white font-bold text-lg leading-snug">
                {t.jobApplication.title}
              </h2>
              <p className="text-white/70 text-sm">{t.jobApplication.subtitle}</p>
            </div>
            <div className="flex gap-3 p-4">
              <ul className="flex flex-col gap-2.5 flex-1 py-1">
                {jobItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="shrink-0 w-28 rounded-lg overflow-hidden self-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&auto=format&fit=crop"
                  alt="Job opportunity"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="px-4 pb-5">
              <Link
                href="/job-application"
                className="block text-center bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold py-3 rounded-lg transition-colors"
              >
                {t.common.applyNow}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
