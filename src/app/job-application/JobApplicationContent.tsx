"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Briefcase, Upload, GraduationCap, ClipboardList, ChevronRight, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const SPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=85&auto=format&fit=crop",
];

const PRIMARY = "#0C2468";
const ACCENT = "#2563eb";

const PERKS = [
  { icon: Briefcase,     en: "Competitive salary & benefits",       bn: "প্রতিযোগিতামূলক বেতন ও সুবিধা" },
  { icon: GraduationCap, en: "Free professional training",           bn: "বিনামূল্যে পেশাদার প্রশিক্ষণ" },
  { icon: ChevronRight,  en: "Career growth opportunities",          bn: "ক্যারিয়ার উন্নয়নের সুযোগ" },
  { icon: ClipboardList, en: "Supportive work environment",          bn: "সহায়ক কর্মপরিবেশ" },
];

export default function JobApplicationContent() {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
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
      const form = e.currentTarget;
      const data = new FormData(form);
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

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Left — Why Join Us */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="h-1.5 w-full" style={{ backgroundColor: PRIMARY }} />
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-1" style={{ color: PRIMARY }}>
                    {isBn ? "কেন আমাদের সাথে যোগ দেবেন?" : "Why Join Nexivio Care?"}
                  </h2>
                  <p className="text-sm text-slate-500 mb-5">
                    {isBn ? "আমরা আমাদের দলের প্রতিটি সদস্যকে মূল্য দিই।" : "We value every member of our team."}
                  </p>
                  <ul className="flex flex-col gap-4">
                    {PERKS.map(({ icon: Icon, en, bn }) => (
                      <li key={en} className="flex items-start gap-3">
                        <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                          <Icon size={16} style={{ color: ACCENT }} />
                        </div>
                        <span className="text-sm text-slate-700">{isBn ? bn : en}</span>
                      </li>
                    ))}
                  </ul>
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
                <h2 className="text-lg font-bold mb-6" style={{ color: PRIMARY }}>
                  {isBn ? "আবেদন ফর্ম পূরণ করুন" : "Fill in Your Application"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label={f.name} name="name" required />
                    <Input label={f.phone} name="phone" type="tel" required />
                  </div>
                  <Textarea label={f.experience} name="experience" required rows={3} />
                  <Textarea label={f.education} name="education" required rows={3} />

                  {/* CV Upload */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      {f.cv} <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl px-4 py-4 transition-colors">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                        <Upload size={16} style={{ color: ACCENT }} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">
                          {fileName ?? (isBn ? "PDF ফাইল বেছে নিন" : "Choose PDF file")}
                        </span>
                        <span className="text-xs text-slate-400">{isBn ? "সর্বোচ্চ ৫ MB" : "Max 5 MB"}</span>
                      </div>
                      <input
                        name="cv"
                        type="file"
                        accept=".pdf"
                        required
                        className="hidden"
                        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                      />
                    </label>
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
