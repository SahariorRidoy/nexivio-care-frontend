"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stethoscope, Heart, Baby, Users, Plus, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import type { Service } from "@/types";

const iconMap: Record<string, LucideIcon> = { Stethoscope, Heart, Baby, Users, Plus };

const CARD_COLORS = ["#1565c0", "#2e7d32", "#c2185b", "#6a1b9a"];

export default function MainServices() {
  const { language, t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.get<{ data: Service[] }>("/services")
      .then((r) => setServices(r.data.filter((s) => s.isActive).slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-14">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-800">
            {t.home.services.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px w-12 bg-primary-600" />
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#388e3c">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            <div className="h-px w-12 bg-primary-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => {
            const Icon = (s.icon && iconMap[s.icon]) || Plus;
            const color = CARD_COLORS[i % CARD_COLORS.length];
            return (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border border-gray-100"
              >
                <div className="relative h-44">
                  {s.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.image} alt={language === "en" ? s.nameEn : s.nameBn} className="w-full h-full object-cover rounded-t-xl" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
                      <Icon size={48} style={{ color }} />
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 left-4 translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg border-2 border-white"
                    style={{ backgroundColor: color }}
                  >
                    <Icon size={22} />
                  </div>
                </div>
                <div className="pt-9 pb-5 px-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    {language === "en" ? s.nameEn : s.nameBn}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                    {language === "en" ? s.shortDescEn : s.shortDescBn}
                  </p>
                  <Link
                    href={`/services/${s.slug}`}
                    className="block text-center text-sm font-semibold text-white py-2.5 rounded-lg transition-opacity hover:opacity-90"
                    style={{ backgroundColor: color }}
                  >
                    {t.common.details}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
