"use client";

import { useState } from "react";
import { Phone, Mail, Facebook, CheckCircle, MapPin, Clock, Send, Youtube, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

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
      icon: Facebook,
      labelEn: "Messenger", labelBn: "মেসেঞ্জার",
      value: "Nexivio Care",
      href: s.messengerUrl,
      external: true,
      color: "#1877f2", bg: "#eff6ff",
    },
    {
      icon: MapPin,
      labelEn: "Address", labelBn: "ঠিকানা",
      value: s.address,
      href: "#map",
      color: "#dc2626", bg: "#fef2f2",
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
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">

            {/* Left — Contact info + map */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Contact method cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {contactMethods.map(({ icon: Icon, labelEn, labelBn, value, href, external, color, bg }) => {
                  const inner = (
                    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-medium">{isBn ? labelBn : labelEn}</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                      </div>
                    </div>
                  );
                  return href && href !== "#map" ? (
                    <a key={labelEn} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                      {inner}
                    </a>
                  ) : (
                    <div key={labelEn}>{inner}</div>
                  );
                })}
              </div>

              {/* Social links */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-semibold mb-3" style={{ color: PRIMARY }}>
                  {isBn ? "সোশ্যাল মিডিয়া" : "Follow Us"}
                </p>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, href, label, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map embed */}
              {s.mapEmbedUrl ? (
                <div id="map" className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-52">
                  <iframe src={s.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
                </div>
              ) : (
                <div id="map" className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-52 bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={28} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">{s.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full" style={{ backgroundColor: PRIMARY }} />
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-bold" style={{ color: PRIMARY }}>
                    {isBn ? "আমাদের বার্তা পাঠান" : "Send Us a Message"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {isBn ? "আমরা সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই।" : "We usually respond within 24 hours."}
                  </p>
                </div>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle size={36} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {isBn ? "বার্তা পাঠানো হয়েছে!" : "Message Sent!"}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-xs">{c.success}</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 text-sm font-semibold underline"
                      style={{ color: PRIMARY }}
                    >
                      {isBn ? "আরেকটি বার্তা পাঠান" : "Send another message"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label={c.form.name} name="name" required />
                      <Input label={c.form.phone} name="phone" type="tel" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label={c.form.email} name="email" type="email" />
                      <Input label={c.form.subject} name="subject" required />
                    </div>
                    <Textarea label={c.form.message} name="message" required rows={5} />
                    <Button type="submit" size="lg" fullWidth isLoading={submitting}>
                      <span className="flex items-center gap-2 justify-center">
                        <Send size={15} /> {c.form.submit}
                      </span>
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
