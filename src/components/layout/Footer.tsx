"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle, Download } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";
import { api } from "@/lib/api";
import type { Service } from "@/types";



export default function Footer() {
  const year = new Date().getFullYear();
  const s = useSettings();
  const { t, language } = useLanguage();

  const quickLinks = [
    { label: t.nav.home,              href: "/" },
    { label: t.nav.about,             href: "/about" },
    { label: t.nav.services,          href: "/services" },
    { label: t.services.categories.others, href: "/other-services" },
    { label: t.jobApplication.title,  href: "/job-application" },
    { label: t.nav.noticeBoard,       href: "/notice-board" },
    // { label: t.nav.contact,           href: "/contact" },
    { label: t.footer.privacyPolicy,  href: "/privacy-policy" },
    { label: t.footer.termsConditions, href: "/terms-conditions" },
  ];

  const [services, setServices] = useState<Service[]>([]);

  const STATIC_SERVICES: Service[] = [
    {
      id: "static-1", slug: "physiotherapy-rehabilitation", icon: "Activity", isActive: true, createdAt: "",
      nameEn: "Physiotherapy & Rehabilitation", nameBn: "ফিজিওথেরাপি ও পুনর্বাসন",
      shortDescEn: "", shortDescBn: "", descriptionEn: "", descriptionBn: "",
      image: "", packages: [], featuresEn: [], featuresBn: [],
    },
    {
      id: "static-2", slug: "on-demand-nursing", icon: "Clock", isActive: true, createdAt: "",
      nameEn: "On-Demand Nursing", nameBn: "অন-ডিমান্ড নার্সিং",
      shortDescEn: "", shortDescBn: "", descriptionEn: "", descriptionBn: "",
      image: "", packages: [], featuresEn: [], featuresBn: [],
    },
    {
      id: "static-3", slug: "home-diagnostics", icon: "FlaskConical", isActive: true, createdAt: "",
      nameEn: "Home Diagnostics", nameBn: "হোম ডায়াগনস্টিক্স",
      shortDescEn: "", shortDescBn: "", descriptionEn: "", descriptionBn: "",
      image: "", packages: [], featuresEn: [], featuresBn: [],
    },
  ];

  useEffect(() => {
    api.get<{ data: Service[] }>("/services")
      .then((r) => {
        const active = r.data.filter((s) => s.isActive);
        const dynamicSlugs = new Set(active.map((s) => s.slug));
        setServices([
          ...active,
          ...STATIC_SERVICES.filter((s) => !dynamicSlugs.has(s.slug)),
        ]);
      })
      .catch(() => setServices(STATIC_SERVICES));
  }, []);

  const displayServices = services.length > 0 ? services : STATIC_SERVICES;

  return (
    <footer style={{ backgroundColor: "#0a1628" }} className="text-slate-300">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* 1 — Brand + description + social */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-3">
              <Image src="/logo.jpeg" alt="Nexivio Care" width={56} height={56} className="object-contain rounded-lg" />
              <div className="leading-tight">
                <p className="font-bold text-white text-base leading-tight">
                  <span className="text-primary-400">Nexivio</span> Care
                </p>
                <p className="text-xs italic text-primary-400">Care you can trust</p>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.footer.description}
            </p>
            {/* Social icons — FB, YT, LinkedIn, Instagram */}
            <div className="flex gap-2">
              <a href={s.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877f2] hover:opacity-90 transition-opacity text-white">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff0000] hover:opacity-90 transition-opacity text-white">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a66c2] hover:opacity-90 transition-opacity text-white">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 transition-opacity text-white">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 2 — Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">{t.footer.quickLinks}</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-slate-400 hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 — Services */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">{t.nav.services}</h3>
            <ul className="flex flex-col gap-2">
              {displayServices.map((svc) => (
                <li key={svc.id}>
                  <Link href={`/services/${svc.slug}`} className="text-xs text-slate-400 hover:text-primary-400 transition-colors">
                    {language === "en" ? svc.nameEn : svc.nameBn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4 — Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">{t.nav.contact}</h3>
            <div className="flex flex-col gap-3">
              <a href={`tel:${s.phone}`}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary-400 transition-colors">
                <Phone size={13} className="shrink-0 text-primary-500" />
                {s.phone}
              </a>
              <a href={`https://wa.me/${s.whatsapp}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-green-400 transition-colors">
                <MessageCircle size={13} className="shrink-0 text-green-500" />
                {s.whatsapp}
              </a>
              <a href={`mailto:${s.email}`}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors">
                <Mail size={13} className="shrink-0 text-blue-400" />
                {s.email}
              </a>
              <span className="flex items-start gap-2 text-xs text-slate-400">
                <MapPin size={13} className="shrink-0 mt-0.5 text-red-400" />
                {s.address}
              </span>
              <button
                onClick={() => {
                  const vcard = [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    `FN:${SITE_CONFIG.name}`,
                    `ORG:${SITE_CONFIG.name}`,
                    `TEL;TYPE=CELL:${s.phone}`,
                    `TEL;TYPE=WORK:${s.whatsapp}`,
                    `EMAIL:${s.email}`,
                    `ADR;TYPE=WORK:;;${s.address};;;;`,
                    `URL:${s.facebookUrl}`,
                    "END:VCARD",
                  ].join("\n");
                  const blob = new Blob([vcard], { type: "text/vcard" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "nexivio-care.vcf";
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
                className="mt-1 cursor-pointer flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors w-fit"
              >
                <Download size={13} />
                Download Card
              </button>
            </div>
          </div>

          {/* 5 — QR Code + Location / Map */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">{t.contact.info.phone !== "Phone" ? "আমাদের অবস্থান" : "Our Location"}</h3>
            {s.qrImageUrl && (
              <div className="mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.qrImageUrl} alt="QR Code" className="h-20 w-20 rounded-lg border border-slate-700 object-contain bg-white p-1" />
                <p className="text-xs text-slate-500 mt-1">{t.footer.scanQR}</p>
              </div>
            )}
            <div className="rounded-lg overflow-hidden h-36 border border-slate-700">
              <iframe
                src={s.mapEmbedUrl ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233667.8223914956!2d90.27923698!3d23.7806207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"}
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nexivio Care Location"
              />
            </div>
            <Link href="/contact" className="mt-1.5 inline-block text-xs text-primary-400 hover:text-primary-300">
              {t.nav.contact} →
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 py-4">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {year} Nexivio Care. All Rights Reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-primary-400 transition-colors">{t.footer.privacyPolicy}</Link>
            <span>·</span>
            <Link href="/terms-conditions" className="hover:text-primary-400 transition-colors">{t.footer.termsConditions}</Link>
            <span>·</span>
            <a href="https://techgeniuslabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">Design & Development: Tech Genius Labs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
