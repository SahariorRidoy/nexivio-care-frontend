"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle, Briefcase, Upload, GraduationCap, ClipboardList,
  ChevronRight, Phone, Star, FileText, CreditCard, Award, User, X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";

const SPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=85&auto=format&fit=crop",
];

const PRIMARY = "#0C2468";
const ACCENT = "#2563eb";

const PERKS = [
  { icon: Briefcase,     en: "Competitive salary & benefits",       bn: "প্রতিযোগিতামূলক বেতন ও সুবিধা" },
  { icon: Star,          en: "Experienced & skilled professionals",  bn: "অভিজ্ঞ ও দক্ষ পেশাদার" },
  { icon: ChevronRight,  en: "Career growth opportunities",          bn: "ক্যারিয়ার উন্নয়নের সুযোগ" },
  { icon: GraduationCap, en: "Free professional training",           bn: "বিনামূল্যে পেশাদার প্রশিক্ষণ" },
  { icon: ClipboardList, en: "Supportive work environment",          bn: "সহায়ক কর্মপরিবেশ" },
];

interface FileUploadFieldProps {
  name: string;
  label: string;
  hint: string;
  accept: string;
  required?: boolean;
  icon: React.ElementType;
  fileName: string | null;
  onChange: (name: string | null) => void;
}

function FileUploadField({ name, label, hint, accept, required, icon: Icon, fileName, onChange }: FileUploadFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
        {!required && <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>}
      </label>
      <label className={`group relative flex items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed px-4 py-3.5 transition-all ${
        fileName
          ? "border-blue-400 bg-blue-50"
          : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
      }`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          fileName ? "bg-blue-100" : "bg-slate-100 group-hover:bg-blue-50"
        }`}>
          <Icon size={18} style={{ color: fileName ? ACCENT : "#94a3b8" }} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className={`text-sm font-medium truncate ${fileName ? "text-blue-700" : "text-slate-600"}`}>
            {fileName ?? (hint)}
          </span>
          <span className="text-xs text-slate-400 mt-0.5">{accept.includes("pdf") ? "PDF" : "JPG / PNG / WEBP"} · max 5 MB</span>
        </div>
        {fileName && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onChange(null); }}
            className="shrink-0 w-6 h-6 rounded-full bg-slate-200 hover:bg-red-100 flex items-center justify-center transition-colors"
          >
            <X size={12} className="text-slate-500 hover:text-red-500" />
          </button>
        )}
        <input
          name={name}
          type="file"
          accept={accept}
          required={required}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0]?.name ?? null)}
        />
      </label>
    </div>
  );
}

export default function JobApplicationContent() {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [nidFile, setNidFile] = useState<string | null>(null);
  const [certFile, setCertFile] = useState<string | null>(null);
  const [headerImage, setHeaderImage] = useState<string>(SPLASH_IMAGES[0]);
  const f = t.jobApplication.form;
  const isBn = language === "bn";

  useEffect(() => {
    api.get<{ data: { image: string; isActive: boolean }[] }>("/banners")
      .then((r) => {
        const img = r.data.find((b) => b.isActive && b.image)?.image;
        if (img) setHeaderImage(img);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData(e.currentTarget);
      await api.upload("/applications", data);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{isBn ? "আবেদন সফলভাবে জমা হয়েছে!" : "Application Submitted!"}</h2>
        <p className="text-slate-500 max-w-sm text-sm">{t.jobApplication.success}</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t.jobApplication.title} subtitle={t.jobApplication.subtitle} bgImage={headerImage} />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Left — Why Join Us */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="h-1.5 w-full" style={{ backgroundColor: PRIMARY }} />
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-1" style={{ color: PRIMARY }}>
                    {isBn ? "কেন আমাদের সাথে যোগ দেবেন?" : "Why Join Nexivio Care?"}
                  </h2>
                  <p className="text-sm text-slate-500 mb-5">
                    {isBn ? "আমরা আমাদের দলের প্রতিটি সদস্যকে মূল্য দিই।" : "We value every member of our team."}
                  </p>
                  <ul className="flex flex-col gap-3.5">
                    {PERKS.map(({ icon: Icon, en, bn }) => (
                      <li key={en} className="flex items-start gap-3">
                        <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                          <Icon size={15} style={{ color: ACCENT }} />
                        </div>
                        <span className="text-sm text-slate-700">{isBn ? bn : en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Steps */}
              <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: "#10b981" }} />
                <div className="p-6">
                  <h3 className="font-bold text-sm text-slate-800 mb-4">{isBn ? "আবেদনের ধাপসমূহ" : "How to Apply"}</h3>
                  <ol className="flex flex-col gap-3">
                    {[
                      { en: "Fill in your personal details", bn: "ব্যক্তিগত তথ্য পূরণ করুন" },
                      { en: "Upload your CV (PDF)", bn: "সিভি আপলোড করুন (PDF)" },
                      { en: "Upload NID image", bn: "NID ছবি আপলোড করুন" },
                      { en: "Attach experience certificate (optional)", bn: "অভিজ্ঞতার সার্টিফিকেট যোগ করুন (ঐচ্ছিক)" },
                      { en: "Submit your application", bn: "আবেদন জমা দিন" },
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-sm text-slate-600">{isBn ? step.bn : step.en}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #163080 100%)` }}>
                <h3 className="font-bold text-base mb-1">{isBn ? "আমাদের সাথে যোগাযোগ করুন" : "Have Questions?"}</h3>
                <p className="text-blue-200 text-sm mb-4">{isBn ? "যেকোনো প্রশ্নের জন্য আমাদের কল করুন।" : "Call us for any queries about the position."}</p>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  <Phone size={14} /> {isBn ? "কল করুন" : "Call Us"}
                </a>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />
              <div className="p-8">
                <div className="mb-7">
                  <h2 className="text-xl font-bold" style={{ color: PRIMARY }}>
                    {isBn ? "আবেদন ফর্ম পূরণ করুন" : "Fill in Your Application"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {isBn ? "সকল তারকা চিহ্নিত ঘর পূরণ করা আবশ্যক।" : "All fields marked with * are required."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                  {/* Personal Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
                        <User size={13} style={{ color: ACCENT }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {isBn ? "ব্যক্তিগত তথ্য" : "Personal Information"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">{f.name} <span className="text-red-500">*</span></label>
                        <input
                          name="name"
                          required
                          placeholder={isBn ? "আপনার পূর্ণ নাম" : "Your full name"}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition placeholder:text-slate-400"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">{f.phone} <span className="text-red-500">*</span></label>
                        <input
                          name="phone"
                          type="tel"
                          required
                          placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
                        <GraduationCap size={13} style={{ color: ACCENT }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {isBn ? "যোগ্যতা ও অভিজ্ঞতা" : "Qualifications & Experience"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">{f.experience} <span className="text-red-500">*</span></label>
                        <textarea
                          name="experience"
                          required
                          rows={3}
                          placeholder={isBn ? "আপনার কর্ম অভিজ্ঞতা বিস্তারিত লিখুন..." : "Describe your work experience in detail..."}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition resize-none placeholder:text-slate-400"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">{f.education} <span className="text-red-500">*</span></label>
                        <textarea
                          name="education"
                          required
                          rows={3}
                          placeholder={isBn ? "আপনার শিক্ষাগত যোগ্যতা লিখুন..." : "Describe your educational qualifications..."}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition resize-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
                        <FileText size={13} style={{ color: ACCENT }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {isBn ? "ডকুমেন্ট আপলোড" : "Document Uploads"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <FileUploadField
                        name="cv"
                        label={isBn ? "সিভি আপলোড করুন" : "Upload CV"}
                        hint={isBn ? "PDF ফাইল বেছে নিন" : "Choose a PDF file"}
                        accept=".pdf"
                        required
                        icon={FileText}
                        fileName={cvFile}
                        onChange={setCvFile}
                      />
                      <FileUploadField
                        name="nid"
                        label={isBn ? "NID আপলোড করুন" : "Upload NID"}
                        hint={isBn ? "NID-এর ছবি বেছে নিন" : "Choose NID image"}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        required
                        icon={CreditCard}
                        fileName={nidFile}
                        onChange={setNidFile}
                      />
                      <FileUploadField
                        name="experienceCert"
                        label={isBn ? "অভিজ্ঞতার সার্টিফিকেট" : "Experience Certificate"}
                        hint={isBn ? "সার্টিফিকেটের ছবি বেছে নিন" : "Choose certificate image"}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        icon={Award}
                        fileName={certFile}
                        onChange={setCertFile}
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" fullWidth isLoading={submitting}>
                    {f.submit}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
