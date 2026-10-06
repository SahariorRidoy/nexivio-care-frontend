"use client";

import { useState } from "react";
import { Phone, Mail, Facebook, CheckCircle, MapPin, Clock, Send, Youtube, Instagram, Linkedin, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import PaymentCard from "@/components/shared/PaymentCard";

function MessengerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.928 1.453 5.542 3.727 7.26V22l3.405-1.869c.909.252 1.871.388 2.868.388 5.523 0 10-4.144 10-9.259C22 6.145 17.523 2 12 2zm1.008 12.457l-2.548-2.718-4.976 2.718 5.474-5.812 2.61 2.718 4.913-2.718-5.473 5.812z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}


const PRIMARY = "#0C2468";
const HEADER_IMAGE = "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=85&auto=format&fit=crop";

export default function ContactContent() {
  const { t, language } = useLanguage();
  const s = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const c = t.contact;
  const isBn = language === "bn";

  const contactMethods = [
    {
      icon: Phone,
      labelEn: "Phone", labelBn: "ফোন",
      value: s.phone,
      href: `tel:${s.phone}`,
      color: "#15803d", bg: "#f0fdf4",
    },
    ...(s.phone2 ? [{
      icon: Phone,
      labelEn: "Phone 2", labelBn: "ফোন ২",
      value: s.phone2,
      href: `tel:${s.phone2}`,
      color: "#15803d", bg: "#f0fdf4",
    }] : []),
    {
      icon: WhatsAppIcon,
      labelEn: "WhatsApp", labelBn: "হোয়াটসঅ্যাপ",
      value: s.whatsapp,
      href: `https://wa.me/${s.whatsapp}`,
      external: true,
      color: "#25d366", bg: "#dcfce7",
    },
    {
      icon: Mail,
      labelEn: "Email", labelBn: "ইমেইল",
      value: s.email,
      href: `mailto:${s.email}`,
      color: "#1d4ed8", bg: "#eff6ff",
    },
    {
      icon: MapPin,
      labelEn: "Address", labelBn: "ঠিকানা",
      value: s.address,
      href: "#map",
      color: "#dc2626", bg: "#fef2f2",
    },
    {
      icon: MessengerIcon,
      labelEn: "Messenger", labelBn: "মেসেঞ্জার",
      value: "Nexivio Care",
      href: s.messengerUrl,
      external: true,
      color: "#1877f2", bg: "#eff6ff",
    },
    {
      icon: Clock,
      labelEn: "Business Hours", labelBn: "সেবার সময়",
      value: s.businessHours ?? (isBn ? "সকাল ৯টা – রাত ৯টা" : "9 AM – 9 PM"),
      href: null,
      color: "#7c3aed", bg: "#f5f3ff",
    },
  ];

  const socialLinks = [
    { icon: Facebook,  href: s.facebookUrl,  label: "Facebook",  color: "#1877f2" },
    { icon: Youtube,   href: s.youtubeUrl,   label: "YouTube",   color: "#dc2626" },
    { icon: Instagram, href: s.instagramUrl, label: "Instagram", color: "#e1306c" },
    { icon: Linkedin,  href: s.linkedinUrl,  label: "LinkedIn",  color: "#0a66c2" },
  ];

  const handleDownloadCard = async () => {
    if (!s.visitingCardUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(s.visitingCardUrl);
      const blob = await res.blob();
      const ext = blob.type.includes("pdf") ? "pdf" : blob.type.split("/")[1] || "png";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nexivio-care-visiting-card.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(s.visitingCardUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      await api.post("/contacts", Object.fromEntries(fd));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title={c.title} subtitle={c.subtitle} bgImage={HEADER_IMAGE} />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

            {/* Left — contact info + social + payment */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                {contactMethods.map(({ icon: Icon, labelEn, labelBn, value, href, external, color, bg }) => {
                  const isHours = labelEn === "Business Hours";
                  const inner = (
                    <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-3 h-full">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-400 font-medium">{isBn ? labelBn : labelEn}</p>
                        <p className="text-xs font-semibold text-slate-800 break-words">{value}</p>
                      </div>
                    </div>
                  );
                  return href && href !== "#map" ? (
                    <a key={labelEn} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{inner}</a>
                  ) : (
                    <div key={labelEn}>{inner}</div>
                  );
                })}
                {/* Follow Us card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400 font-medium shrink-0">{isBn ? "সোশ্যাল মিডিয়া" : "Follow Us"}</p>
                  <div className="flex gap-1.5">
                    {socialLinks.map(({ icon: SIcon, href: sHref, label: sLabel, color: sColor }) => (
                      <a key={sLabel} href={sHref} target="_blank" rel="noopener noreferrer" aria-label={sLabel}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${sColor}15`, color: sColor }}>
                        <SIcon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <PaymentCard />

              {/* Visiting Card Download */}
              {s.visitingCardUrl && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-primary-700 to-blue-500" />
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                      <span className="text-2xl">🪪</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {isBn ? "ভিজিটিং কার্ড" : "Visiting Card"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isBn ? "আমাদের ভিজিটিং কার্ড ডাউনলোড করুন" : "Download our visiting card"}
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadCard}
                      disabled={downloading}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                    >
                      <Download size={15} />
                      {downloading
                        ? (isBn ? "ডাউনলোড হচ্ছে..." : "Downloading...")
                        : (isBn ? "ডাউনলোড" : "Download")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right — form */}
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: PRIMARY }} />
                <div className="p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-bold" style={{ color: PRIMARY }}>
                      {isBn ? "আমাদের বার্তা পাঠান" : "Send Us a Message"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {isBn ? "আমরা সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই।" : "We usually respond within 24 hours."}
                    </p>
                  </div>
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle size={36} className="text-green-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{isBn ? "বার্তা পাঠানো হয়েছে!" : "Message Sent!"}</h3>
                      <p className="text-slate-500 text-sm max-w-xs">{c.success}</p>
                      <button onClick={() => setSubmitted(false)} className="mt-2 text-sm font-semibold underline" style={{ color: PRIMARY }}>
                        {isBn ? "আরেকটি বার্তা পাঠান" : "Send another message"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input label={c.form.name} name="name" required />
                        <Input label={c.form.phone} name="phone" type="tel" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label={c.form.email} name="email" type="email" />
                        <Input label={c.form.subject} name="subject" required />
                      </div>
                      <Textarea label={c.form.message} name="message" required rows={4} />
                      <Button type="submit" size="lg" fullWidth isLoading={submitting}>
                        <span className="flex items-center gap-2 justify-center"><Send size={15} /> {c.form.submit}</span>
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
