"use client";

import { GraduationCap, BadgeCheck, Zap, Headphones } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SectionTitle from "@/components/shared/SectionTitle";

const items = [
  { icon: GraduationCap, key: "trainedStaff" as const, color: "bg-primary-100 text-primary-700" },
  { icon: BadgeCheck, key: "verifiedCaregiver" as const, color: "bg-green-100 text-green-700" },
  { icon: Zap, key: "fastResponse" as const, color: "bg-amber-100 text-amber-700" },
  { icon: Headphones, key: "support247" as const, color: "bg-purple-100 text-purple-700" },
];

export default function WhyChooseUs() {
  const { t } = useLanguage();
  const why = t.home.whyChoose;

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionTitle title={why.title} subtitle={why.subtitle} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, key, color }) => {
            const item = why.items[key];
            return (
              <div
                key={key}
                className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${color}`}>
                  <Icon size={28} />
                </div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
