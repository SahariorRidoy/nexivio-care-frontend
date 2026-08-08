"use client";

import { Phone, MessageCircle, Facebook, MessagesSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";

export default function ContactCTA() {
  const { t } = useLanguage();
  const s = useSettings();
  const cta = t.home.contactCta;

  const contacts = [
    {
      Icon: Phone,
      label: t.common.callNow,
      sub: s.phone,
      href: `tel:${s.phone}`,
      bg: "bg-primary-600 hover:bg-primary-700",
      iconBg: "bg-primary-700",
    },
    {
      Icon: MessageCircle,
      label: t.common.whatsapp,
      sub: s.whatsapp,
      href: `https://wa.me/${s.whatsapp}`,
      bg: "bg-green-600 hover:bg-green-700",
      iconBg: "bg-green-700",
      external: true,
    },
    {
      Icon: Facebook,
      label: t.common.messenger,
      sub: "Nexivio Care",
      href: s.messengerUrl,
      bg: "bg-blue-600 hover:bg-blue-700",
      iconBg: "bg-blue-700",
      external: true,
    },
    {
      Icon: MessagesSquare,
      label: t.common.liveChat,
      sub: "২৪/৭ অনলাইন",
      href: s.messengerUrl,
      bg: "bg-purple-600 hover:bg-purple-700",
      iconBg: "bg-purple-700",
      external: true,
    },
  ];

  return (
    <section className="bg-gray-100 pt-6 pb-14">
      <div className="container mx-auto max-w-7xl px-4">

        {/* Header */}
        <div className="text-center mb-10">
          {/* <span className="inline-block rounded-full bg-primary-700/30 px-3 py-1 text-xs font-semibold text-primary-400 mb-3">
            {t.nav.contact}
          </span> */}
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{cta.title}</h2>
          <p className="mt-2 text-slate-500 text-base sm:text-lg">{cta.subtitle}</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {contacts.map(({ Icon, label, sub, href, bg, iconBg, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={`group flex flex-col items-center gap-3 rounded-2xl p-6 text-center text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${bg}`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconBg} transition-transform duration-200 group-hover:scale-110`}>
                <Icon size={26} />
              </div>
              <div>
                <p className="font-bold text-lg">{label}</p>
                <p className="text-sm text-white/70 mt-0.5">{sub}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
