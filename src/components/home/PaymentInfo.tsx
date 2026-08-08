"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { Copy, CheckCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="ml-2 p-1 rounded text-slate-400 hover:text-primary-600 transition-colors shrink-0"
      title="Copy"
    >
      {copied ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-slate-800">{value}</span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

export default function PaymentInfo() {
  const { language } = useLanguage();
  const s = useSettings();
  const isBn = language === "bn";

  const bankDetails = [
    { label: isBn ? "অ্যাকাউন্টের নাম" : "Account Name",   value: "Nexivio Care" },
    { label: isBn ? "অ্যাকাউন্ট নম্বর" : "Account Number", value: "00130210021569" },
    { label: isBn ? "ব্যাংক"           : "Bank",            value: "NCC Bank" },
    { label: isBn ? "শাখা"             : "Branch",          value: "Malibagh Branch" },
    { label: isBn ? "রাউটিং নম্বর"    : "Routing No",      value: "160273948" },
    { label: "SWIFT CODE",                                    value: "NCCLBDDHMBB" },
  ];

  const mobilePayments = [
    {
      name: "bKash",
      number: s.whatsapp,
      color: "from-pink-500 to-rose-600",
      lightBg: "bg-pink-50",
      border: "border-pink-200",
      textColor: "text-pink-700",
      logo: "/bkash logo.png",
      type: isBn ? "সেন্ড মানি" : "Send Money",
    },
    {
      name: "Nagad",
      number: s.phone,
      color: "from-orange-500 to-amber-600",
      lightBg: "bg-orange-50",
      border: "border-orange-200",
      textColor: "text-orange-700",
      logo: "/nagad logo.png",
      type: isBn ? "সেন্ড মানি" : "Send Money",
    },
  ];

  return (
    <section className="py-12" style={{ background: "linear-gradient(135deg, #0C2468 0%, #163080 100%)" }}>
      <div className="container mx-auto max-w-6xl px-4">

        {/* Header */}
        <div className="text-center mb-6">
          {/* <span className="inline-block mb-3 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-white/20 text-white/70">
            {isBn ? "পেমেন্ট তথ্য" : "Payment Information"}
          </span> */}
          <h2 className="text-3xl font-bold text-white">
            {isBn ? "পেমেন্ট করুন সহজেই" : "Easy Payment Options"}
          </h2>
          <p className="mt-3 text-blue-200 text-base max-w-lg mx-auto">
            {isBn
              ? "ব্যাংক ট্রান্সফার বা মোবাইল ব্যাংকিংয়ের মাধ্যমে সহজেই পেমেন্ট করুন"
              : "Pay conveniently via bank transfer or mobile banking"}
          </p>
          <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-400 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Bank Transfer */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Card header */}
            <div className="px-6 py-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #0C2468, #1a3a8f)" }}>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🏦</div>
              <div>
                <p className="text-white font-bold text-lg">{isBn ? "ব্যাংক ট্রান্সফার" : "Bank Transfer"}</p>
                <p className="text-blue-200 text-sm">{isBn ? "সরাসরি ব্যাংক অ্যাকাউন্টে পাঠান" : "Send directly to bank account"}</p>
              </div>
            </div>
            {/* Details */}
            <div className="px-6 py-4">
              {bankDetails.map(({ label, value }) => (
                <Row key={label} label={label} value={value} />
              ))}
            </div>
            <div className="px-6 pb-5">
              <p className="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                💡 {isBn
                  ? "পেমেন্টের পর ট্রানজেকশন আইডি আমাদের হোয়াটসঅ্যাপে পাঠান।"
                  : "After payment, send the transaction ID to our WhatsApp."}
              </p>
            </div>
          </div>

          {/* Mobile Banking */}
          <div className="flex flex-col gap-6">
            {mobilePayments.map(({ name, number, color, lightBg, border, textColor, logo, type }) => (
              <div key={name} className={`bg-white rounded-2xl overflow-hidden shadow-2xl`}>
                <div className={`px-6 py-4 flex items-center gap-3 bg-gradient-to-r ${color}`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                    <Image src={logo} alt={name} width={40} height={40} className="object-contain" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{name}</p>
                    <p className="text-white/70 text-sm">{isBn ? "মোবাইল ব্যাংকিং" : "Mobile Banking"}</p>
                  </div>
                  <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${lightBg} ${textColor} border ${border}`}>
                    {type}
                  </span>
                </div>
                <div className="px-6 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1">{isBn ? "নম্বর" : "Number"}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-wide">{number}</p>
                  </div>
                  <CopyButton text={number} />
                </div>
              </div>
            ))}

            {/* Note */}
            <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4">
              <p className="text-white/90 text-base font-semibold mb-1">
                {isBn ? "📌 গুরুত্বপূর্ণ নোট" : "📌 Important Note"}
              </p>
              <p className="text-blue-200 text-sm leading-relaxed">
                {isBn
                  ? "পেমেন্ট সম্পন্ন হলে স্ক্রিনশট সহ আমাদের সাথে যোগাযোগ করুন। বুকিং নিশ্চিত হওয়ার পরেই পেমেন্ট করুন।"
                  : "After completing payment, contact us with a screenshot. Please pay only after your booking is confirmed."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
