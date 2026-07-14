"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { SITE_CONFIG } from "@/lib/constants";

const WA_ICON = (
  <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
    <circle cx="24" cy="24" r="24" fill="white" />
    <path fill="#25d366" d="M24 4C13 4 4 13 4 24c0 3.6.94 7 2.58 9.94L4 44l10.3-2.7A19.94 19.94 0 0 0 24 44c11 0 20-9 20-20S35 4 24 4z" />
    <path fill="white" d="M33.5 28.4c-.5-.25-3-1.48-3.46-1.65-.46-.17-.8-.25-1.13.25-.34.5-1.3 1.65-1.6 1.99-.3.34-.59.38-1.09.13-.5-.25-2.12-.78-4.04-2.49-1.49-1.33-2.5-2.97-2.79-3.47-.3-.5-.03-.77.22-1.02.23-.22.5-.58.75-.87.25-.29.33-.5.5-.83.17-.33.08-.63-.04-.87-.13-.25-1.13-2.72-1.55-3.73-.4-.98-.82-.84-1.13-.86-.29-.01-.63-.02-.96-.02-.34 0-.88.13-1.34.63-.46.5-1.75 1.71-1.75 4.17s1.79 4.84 2.04 5.17c.25.33 3.53 5.39 8.55 7.56 1.2.52 2.13.83 2.86 1.06 1.2.38 2.3.33 3.16.2.96-.14 2.97-1.21 3.39-2.38.42-1.17.42-2.17.29-2.38-.12-.21-.46-.33-.96-.58z" />
  </svg>
);

export default function FloatingButtons() {
  const s = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const waHref = `https://wa.me/${s.whatsapp}?text=${encodeURIComponent("হ্যালো, আমাকে সেবা সম্পর্কে জানাতে চাই।")}`;

  function downloadVCard() {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${SITE_CONFIG.name}`,
      `ORG:${SITE_CONFIG.name}`,
      `TEL;TYPE=CELL:${s.phone}`,
      `TEL;TYPE=CELL:${s.whatsapp}`,
      `EMAIL:${s.email}`,
      `ADR;TYPE=WORK:;;${s.address};;;;BD`,
      `URL:https://nexiviocare.com`,
      `X-SOCIALPROFILE;type=facebook:${s.facebookUrl}`,
      "END:VCARD",
    ].join("\n");
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nexivio-care.vcf";
    a.click();
  }

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* QR Popup */}
      {open && (
        <div className="mb-1 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0a1628] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary-500 flex items-center justify-center">
                <svg viewBox="0 0 48 48" width="18" height="18" fill="none">
                  <circle cx="24" cy="24" r="23" fill="#2e7d32" />
                  <rect x="21" y="14" width="6" height="20" rx="2" fill="white" />
                  <rect x="14" y="21" width="20" height="6" rx="2" fill="white" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  <span className="text-primary-400">Nexivio</span> Care
                </p>
                <p className="text-[10px] text-primary-400 italic">Care you can trust</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2 px-4 pt-4 pb-2">
            <p className="text-[11px] text-slate-500 text-center">স্ক্যান করুন — কন্টাক্ট সেভ করুন</p>
            <div className="rounded-xl border-2 border-primary-100 p-2 bg-white">
              {s.qrImageUrl ? (
                <Image src={s.qrImageUrl} alt="Nexivio Care QR Code" width={180} height={180} className="rounded-lg" />
              ) : (
                /* Fallback: QR pointing to website */
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("BEGIN:VCARD\nVERSION:3.0\nFN:Nexivio Care\nORG:Nexivio Care\nTEL;TYPE=CELL:" + s.phone + "\nEMAIL:" + s.email + "\nURL:https://nexiviocare.com\nEND:VCARD")}&color=0a1628&bgcolor=ffffff&qzone=1`}
                  alt="Nexivio Care QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                  unoptimized
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="px-4 py-2 space-y-1.5 text-[11px] text-slate-600">
            <p>📞 {s.phone}</p>
            <p>💬 {s.whatsapp}</p>
            <p>✉️ {s.email}</p>
            <p>📍 {s.address}</p>
            <p>🌐 nexiviocare.com</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 px-4 pb-4 pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#25d366] py-2 text-[11px] font-semibold text-white hover:bg-[#20ba5a] transition-colors"
            >
              <svg viewBox="0 0 32 32" width="13" height="13" fill="white">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.474 2.02 7.775L0 32l8.469-2.222A15.929 15.929 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.273 19.346c-.397-.2-2.352-1.16-2.717-1.293-.364-.133-.63-.2-.895.2-.265.4-1.028 1.293-1.26 1.56-.232.267-.464.3-.862.1-.397-.2-1.677-.618-3.195-1.972-1.18-1.054-1.977-2.355-2.21-2.754-.232-.4-.025-.616.175-.815.18-.178.397-.464.596-.696.2-.232.265-.4.397-.664.133-.265.067-.497-.033-.697-.1-.2-.895-2.156-1.227-2.952-.322-.775-.648-.67-.895-.682-.232-.011-.497-.014-.762-.014a1.46 1.46 0 0 0-1.06.497c-.364.4-1.39 1.36-1.39 3.315s1.423 3.847 1.622 4.113c.2.265 2.8 4.275 6.782 5.993.948.41 1.688.655 2.265.838.952.303 1.818.26 2.502.158.763-.113 2.352-.962 2.683-1.89.332-.928.332-1.723.232-1.89-.1-.166-.364-.265-.762-.464z" />
              </svg>
              WhatsApp
            </a>
            <button
              onClick={downloadVCard}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0a1628] py-2 text-[11px] font-semibold text-white hover:bg-[#1a2d4a] transition-colors"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              কন্টাক্ট সেভ
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-xl hover:scale-110 transition-transform"
      >
        {WA_ICON}
      </a>

      {/* QR Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Show QR Code"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0a1628] text-white shadow-xl hover:bg-[#1a2d4a] transition-colors border-2 border-primary-500"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
          <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
          <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
          <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
