"use client";

import Link from "next/link";
import { Stethoscope, Heart, Baby, Users, BookOpen, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const services = [
  { key: "nursing" as const, href: "/services/nursing-service", Icon: Stethoscope, color: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white" },
  { key: "caregiver" as const, href: "/services/caregiver-service", Icon: Heart, color: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white" },
  { key: "babyCare" as const, href: "/services/baby-nanny-care", Icon: Baby, color: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white" },
  { key: "elderCare" as const, href: "/services/elder-care", Icon: Users, color: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" },
  { key: "training" as const, href: "/training", Icon: BookOpen, color: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" },
  { key: "jobApply" as const, href: "/job-application", Icon: Briefcase, color: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white" },
];

export default function QuickServices() {
  const { t } = useLanguage();
  const labels = t.home.quickServices.items;

  return (
    <section className="bg-white py-10 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map(({ key, href, Icon, color }) => (
            <Link
              key={key}
              href={href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-transparent"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 ${color}`}>
                <Icon size={28} />
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                {labels[key]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
