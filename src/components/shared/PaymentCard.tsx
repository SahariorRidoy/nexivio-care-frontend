"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Copy, CheckCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 rounded text-slate-400 hover:text-primary-600 transition-colors shrink-0"
    >
      {copied ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

export default function PaymentCard() {
  const { language } = useLanguage();
  const s = useSettings();
  const isBn = language === "bn";

  const bankDetails = [
    { label: isBn ? "অ্যাকাউন্টের নাম" : "Account Name",   value: "Nexivio Care" },
    { label: isBn ? "অ্যাকাউন্ট নম্বর" : "Account Number", value: "00130210021569" },
    { label: isBn ? "ব্যাংক"           : "Bank",            value: "NCC Bank" },
    { label: isBn ? "শাখা"             : "Branch",          value: "Malibagh Branch" },
    { label: isBn ? "রাউটিং নম্বর"    : "Routing No",      value: "160273948" },
    { label: "SWIFT",                                         value: "NCCLBDDHMBB" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #0C2468, #1a3a8f)" }}>
        <span className="text-lg">💳</span>
        <p className="text-white font-bold text-sm">{isBn ? "পেমেন্ট তথ্য" : "Payment Info"}</p>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Mobile payments */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "bKash",  number: s.whatsapp, logo: "/bkash logo.png",  bg: "bg-pink-50",   border: "border-pink-200",   text: "text-pink-700" },
            { name: "Nagad",  number: s.phone,    logo: "/nagad logo.png",  bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
          ].map(({ name, number, logo, bg, border, text }) => (
            <div key={name} className={`rounded-xl border ${border} ${bg} p-3`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded bg-white flex items-center justify-center overflow-hidden shrink-0">
                  <Image src={logo} alt={name} width={20} height={20} className="object-contain" />
                </div>
                <span className={`text-xs font-bold ${text}`}>{name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">{number}</span>
                <CopyBtn text={number} />
              </div>
            </div>
          ))}
        </div>

        {/* Bank details */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-500 mb-2">🏦 {isBn ? "ব্যাংক ট্রান্সফার" : "Bank Transfer"}</p>
          <div className="flex flex-col gap-1">
            {bankDetails.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{label}</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs font-semibold text-slate-700">{value}</span>
                  <CopyBtn text={value} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          💡 {isBn ? "পেমেন্টের পর ট্রানজেকশন আইডি হোয়াটসঅ্যাপে পাঠান।" : "After payment, send transaction ID to our WhatsApp."}
        </p>
      </div>
    </div>
  );
}
