"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface TeamMember {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string | null;
  roleBn: string | null;
  image: string | null;
  bio: string | null;
}

interface StaffMember {
  id: string;
  nameEn: string;
  nameBn: string;
  designationEn: string | null;
  designationBn: string | null;
  image: string | null;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export default function HomeTeam() {
  const { t, language } = useLanguage();
  const isBn = language === "bn";
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    fetch(`${API}/team`)
      .then((r) => r.json())
      .then((j) => { if (j?.data?.length) setTeam(j.data.slice(0, 4)); })
      .catch(() => {});
    fetch(`${API}/staff`)
      .then((r) => r.json())
      .then((j) => { if (j?.data?.length) setStaff(j.data.slice(0, 4)); })
      .catch(() => {});
  }, []);

  if (team.length === 0 && staff.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-4">

        {/* Management Team */}
        {team.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold" style={{ color: "#0C2468" }}>{t.about.team.title}</h2>
              {t.about.team.subtitle && (
                <p className="mt-3 text-slate-500 text-sm max-w-xl mx-auto">{t.about.team.subtitle}</p>
              )}
              <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-500 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((m) => {
                const name = isBn ? m.nameBn : m.nameEn;
                const role = isBn ? m.roleBn : m.roleEn;
                return (
                  <div key={m.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-4/3 bg-slate-100 overflow-hidden">
                      {m.image ? (
                        <img src={m.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary-200">{name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="p-5 border-t-2 border-primary-500">
                      <p className="font-bold text-slate-900 text-base">{name}</p>
                      {role && <p className="text-sm font-semibold text-primary-600 mt-1 uppercase tracking-wide">{role}</p>}
                      {m.bio && <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{m.bio}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Staff */}
        {staff.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold" style={{ color: "#0C2468" }}>{t.about.staff.title}</h2>
              <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-500 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {staff.map((m) => {
                const name = isBn ? m.nameBn : m.nameEn;
                const designation = isBn ? m.designationBn : m.designationEn;
                return (
                  <div key={m.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-4/3 bg-slate-100 overflow-hidden">
                      {m.image ? (
                        <img src={m.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary-200">{name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="p-5 border-t-2 border-primary-500">
                      <p className="font-bold text-slate-900 text-base">{name}</p>
                      {designation && <p className="text-sm font-semibold text-primary-600 mt-1 uppercase tracking-wide">{designation}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/about"
            className="inline-block px-6 py-2.5 rounded-lg border-2 border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-600 hover:text-white transition-colors"
          >
            {isBn ? "সম্পূর্ণ দল দেখুন" : "View Full Team"}
          </Link>
        </div>

      </div>
    </section>
  );
}
