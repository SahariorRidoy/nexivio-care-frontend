"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Target, TrendingUp, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";

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
  pointsEn: string[];
  pointsBn: string[];
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

// Placeholder images using a reliable service
const PROFILE_IMG = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80";
const MISSION_IMG = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80";
const VISION_IMG  = "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80";

export default function AboutContent() {
  const { t, language } = useLanguage();
  const s = useSettings();
  const isBn = language === "bn";
  const about = t.about;

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [teamPage, setTeamPage] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API}/team`).then(r => r.json()).then(j => { if (j?.data?.length) setTeam(j.data); }).catch(() => {});
    fetch(`${API}/staff`).then(r => r.json()).then(j => { if (j?.data?.length) setStaff(j.data); }).catch(() => {});
  }, []);

  const teamPages = Math.ceil(team.length / 3);
  const visibleTeam = team.slice(teamPage * 3, teamPage * 3 + 3);

  const missionText = isBn ? (s.missionBn ?? about.mission.description) : (s.missionEn ?? about.mission.description);
  const visionText  = isBn ? (s.visionBn  ?? about.vision.description)  : (s.visionEn  ?? about.vision.description);

  return (
    <>
      {/* ── Banner ─────────────────────────────────────────────────────── */}
      <section className="relative h-52 sm:h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PROFILE_IMG})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(12,36,104,0.88) 0%, rgba(12,36,104,0.55) 100%)" }} />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <span className="inline-block mb-3 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-white/30 text-white/80 backdrop-blur-sm">
            Nexivio Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{about.title}</h1>
          <p className="mt-2 text-blue-200 text-sm max-w-md">{about.subtitle}</p>
          <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-400 mx-auto" />
        </div>
      </section>

      {/* ── Company Profile — image left, text right ────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <img src={PROFILE_IMG} alt="Company Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -right-5 w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
                <img src={MISSION_IMG} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg hidden sm:flex">
                <span className="text-white text-xs font-bold text-center leading-tight px-2">Since<br/>2020</span>
              </div>
            </div>
            <div>
              <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-primary-600">
                {about.profile.title}
              </span>
              <h2 className="text-3xl font-bold leading-snug mb-5" style={{ color: "#0C2468" }}>
                {isBn ? "বাংলাদেশের বিশ্বস্ত হোম হেলথকেয়ার সেবা" : "Trusted Home Healthcare Services in Bangladesh"}
              </h2>
              <p className="text-slate-600 leading-relaxed text-base mb-6">{about.profile.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "500+", label: isBn ? "সন্তুষ্ট পরিবার" : "Happy Families" },
                  { num: "50+",  label: isBn ? "প্রশিক্ষিত কর্মী" : "Trained Staff" },
                  { num: "5+",   label: isBn ? "বছরের অভিজ্ঞতা" : "Years Experience" },
                  { num: "24/7", label: isBn ? "সহায়তা সেবা" : "Support Available" },
                ].map(({ num, label }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-2xl font-bold" style={{ color: "#0C2468" }}>{num}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission — text left, image right ───────────────────────────── */}
      <section id="mission" className="py-20" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)" }}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* <span className="inline-flex items-center gap-2 mb-3 text-xs font-semibold tracking-widest uppercase text-primary-600">
                <Target size={14} /> {about.mission.title}
              </span> */}
              <h2 className="text-4xl font-bold leading-snug mb-5" style={{ color: "#0C2468" }}>
                {isBn ? "আমাদের মিশন ও প্রতিশ্রুতি" : "Our Mission & Commitment"}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">{missionText}</p>
              <ul className="space-y-3">
                {(isBn
                  ? ["প্রতিটি পরিবারে মানসম্পন্ন সেবা", "প্রশিক্ষিত ও যাচাইকৃত কর্মী", "সাশ্রয়ী মূল্যে পেশাদার সেবা"]
                  : ["Quality care for every family", "Trained & verified caregivers", "Affordable professional service"]
                ).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary-600 mt-0.5 shrink-0" />
                    <span className="text-slate-700 text-md">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <img src={MISSION_IMG} alt="Our Mission" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary-600 text-white rounded-2xl p-5 shadow-xl hidden sm:block">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-primary-100 mt-0.5">{isBn ? "প্রতিশ্রুতিবদ্ধ" : "Committed"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision — image left, text right ────────────────────────────── */}
      <section id="vision" className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <img src={VISION_IMG} alt="Our Vision" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-xl hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{isBn ? "ক্রমবর্ধমান" : "Growing"}</p>
                    <p className="text-xs text-slate-400">{isBn ? "প্রতি বছর" : "Every year"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              {/* <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-green-600">
                {about.vision.title}
              </span> */}
              <h2 className="text-4xl font-bold leading-snug mb-5" style={{ color: "#0C2468" }}>
                {isBn ? "আমাদের ভবিষ্যৎ দৃষ্টিভঙ্গি" : "Our Vision for the Future"}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">{visionText}</p>
              <ul className="space-y-3">
                {(isBn
                  ? ["বাংলাদেশের সেরা হোম হেলথকেয়ার প্রতিষ্ঠান", "আন্তর্জাতিক মানের সেবা নিশ্চিত করা", "প্রযুক্তি ব্যবহারে সেবা আধুনিকায়ন"]
                  : ["Leading home healthcare in Bangladesh", "Ensuring internationally standard care", "Modernizing services through technology"]
                ).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700 text-md">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Goals & Future Plans ────────────────────────────────────────── */}
      <section id="future-plan" className="py-20" style={{ background: "linear-gradient(135deg, #0C2468 0%, #163080 100%)" }}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            {/* <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-blue-300">
              {isBn ? "আমাদের পথচলা" : "Our Direction"}
            </span> */}
            <h2 className="text-3xl font-bold text-white">
              {isBn ? "লক্ষ্য ও ভবিষ্যৎ পরিকল্পনা" : "Goals & Future Plans"}
            </h2>
            <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-400 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Goals */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-500/30 flex items-center justify-center">
                  <Target size={20} className="text-primary-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">{about.goals.title}</h3>
              </div>
              <ul className="space-y-4">
                {(isBn
                  ? [
                      "প্রতিটি পরিবারে মানসম্পন্ন স্বাস্থ্যসেবা পৌঁছে দেওয়া",
                      "দেশজুড়ে দক্ষ কেয়ারগিভার তৈরি করা",
                      "সাশ্রয়ী মূল্যে পেশাদার সেবা নিশ্চিত করা",
                      "স্বাস্থ্যসেবা খাতে কর্মসংস্থান সৃষ্টি করা",
                    ]
                  : [
                      "Deliver quality healthcare to every family",
                      "Build skilled caregivers across the country",
                      "Ensure professional service at affordable cost",
                      "Create employment in the healthcare sector",
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary-500/40 text-primary-200 text-md font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-blue-100 text-md leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Future Plans */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/30 flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">{about.futurePlan.title}</h3>
              </div>
              <ul className="space-y-4">
                {(isBn
                  ? [
                      "সারা বাংলাদেশে শাখা সম্প্রসারণ",
                      "অনলাইন সেবা ও অ্যাপ চালু করা",
                      "আন্তর্জাতিক মানের প্রশিক্ষণ কেন্দ্র স্থাপন",
                      "বিদেশে কর্মী প্রেরণের সুযোগ তৈরি",
                    ]
                  : [
                      "Expand branches nationwide",
                      "Launch online services & mobile app",
                      "Establish internationally accredited training centers",
                      "Create opportunities for overseas placement",
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-green-500/40 text-green-200 text-md font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-blue-100 text-md leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Office Address & Map ─────────────────────────────────────────── */}
      <section id="office" className="py-20" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)" }}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: "#0C2468" }}>
              {isBn ? "আমাদের অফিস" : "Find Our Office"}
            </h2>
            <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left — contact info cards */}
            <div className="flex flex-col gap-4 justify-center">
              {([
                { icon: <MapPin size={20} className="text-white" />, label: isBn ? "অফিস ঠিকানা" : "Office Address", value: s.address, bg: "bg-primary-600" },
                { icon: <span className="text-white text-base">📞</span>, label: isBn ? "ফোন" : "Phone", value: s.phone, bg: "bg-green-600" },
                { icon: <span className="text-white text-base">✉️</span>, label: isBn ? "ইমেইল" : "Email", value: s.email, bg: "bg-sky-600" },
                ...(s.businessHours ? [{ icon: <span className="text-white text-base">🕐</span>, label: isBn ? "অফিস সময়" : "Business Hours", value: s.businessHours, bg: "bg-amber-500" }] : []),
              ] as { icon: React.ReactNode; label: string; value: string; bg: string }[]).map(({ icon, label, value, bg }) => (
                <div key={label} className="flex items-start gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-0.5">{label}</p>
                    <p className="text-slate-800 font-medium text-base">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — map embed */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-100" style={{ minHeight: "380px" }}>
              <iframe
                src={s.mapEmbedUrl ?? `https://maps.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ minHeight: "380px", border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Management Team ─────────────────────────────────────────────── */}
      <section id="team" className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            {/* <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-primary-600">
              {isBn ? "নেতৃত্ব" : "Leadership"}
            </span> */}
            <h2 className="text-3xl font-bold" style={{ color: "#0C2468" }}>{about.team.title}</h2>
            {about.team.subtitle && <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm">{about.team.subtitle}</p>}
            <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-500 mx-auto" />
          </div>

          {team.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, i) => (
                <PlaceholderTeamCard key={i} index={i} />
              ))}
            </div>
          ) : (
            <>
              <div ref={sliderRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {visibleTeam.map((m) => (
                  <TeamCard key={m.id} member={m} isBn={isBn} />
                ))}
              </div>
              {teamPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    onClick={() => setTeamPage((p) => Math.max(0, p - 1))}
                    disabled={teamPage === 0}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: teamPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setTeamPage(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === teamPage ? "bg-primary-600 w-6" : "bg-slate-300"}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setTeamPage((p) => Math.min(teamPages - 1, p + 1))}
                    disabled={teamPage === teamPages - 1}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Our Staff ───────────────────────────────────────────────────── */}
      {staff.length > 0 && (
        <section id="staff" className="py-20" style={{ background: "#f8faff" }}>
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              {/* <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-primary-600">
                {isBn ? "আমাদের দল" : "Our Team"}
              </span> */}
              <h2 className="text-3xl font-bold" style={{ color: "#0C2468" }}>{about.staff.title}</h2>
              <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-500 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staff.map((m) => (
                <StaffCard key={m.id} member={m} isBn={isBn} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ── Team Card ──────────────────────────────────────────────────────────────────
function TeamCard({ member: m, isBn }: { member: TeamMember; isBn: boolean }) {
  const name = isBn ? m.nameBn : m.nameEn;
  const role = isBn ? m.roleBn : m.roleEn;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
        {m.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary-200">
            {name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5 border-t-2 border-primary-500">
        <p className="font-bold text-slate-900 text-base">{name}</p>
        {role && (
          <p className="text-md font-semibold text-primary-600 mt-1 uppercase tracking-wide">{role}</p>
        )}
        {m.bio && (
          <p className="text-md text-slate-500 mt-2 leading-relaxed line-clamp-2">{m.bio}</p>
        )}
      </div>
    </div>
  );
}

function PlaceholderTeamCard({ index }: { index: number }) {
  const names = ["Executive Director", "Operations Manager", "Head of Training"];
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="aspect-4/3 bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <span className="text-5xl font-bold text-slate-300">{String.fromCharCode(65 + index)}</span>
      </div>
      <div className="p-5 border-t-2 border-slate-200">
        <p className="font-bold text-slate-400 text-base">Team Member</p>
        <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wide">{names[index]}</p>
      </div>
    </div>
  );
}

// ── Staff Card ─────────────────────────────────────────────────────────────────
function StaffCard({ member: m, isBn }: { member: StaffMember; isBn: boolean }) {
  const name        = isBn ? m.nameBn : m.nameEn;
  const designation = isBn ? m.designationBn : m.designationEn;
  const points      = isBn ? m.pointsBn : m.pointsEn;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
        {m.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary-200">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-5 border-t-2 border-primary-500">
        <p className="font-bold text-slate-900 text-base">{name}</p>
        {designation && (
          <p className="text-md font-semibold text-primary-600 mt-1 uppercase tracking-wide">{designation}</p>
        )}
        {points.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-md text-slate-600">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
