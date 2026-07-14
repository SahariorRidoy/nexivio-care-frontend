"use client";

import { use, useEffect, useState } from "react";
import { Clock, BadgeDollarSign, Award, Monitor, MapPin, CheckCircle, BookOpen, CalendarDays, Timer } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/ui/Card";
import type { Training } from "@/types";

const CLASS_TYPE_LABELS: Record<string, { en: string; bn: string }> = {
  online:  { en: "Online",           bn: "অনলাইন" },
  offline: { en: "Offline",          bn: "অফলাইন" },
  both:    { en: "Online & Offline",  bn: "অনলাইন ও অফলাইন" },
};

const PRIMARY = "#0C2468";
const ACCENT  = "#2563eb";

export default function TrainingDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const [training, setTraining] = useState<Training | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    api.get<{ data: Training }>(`/training/${slug}`)
      .then((r) => setTraining(r.data))
      .catch(() => {});
  }, [slug]);

  const title = training
    ? (language === "en" ? training.titleEn : training.titleBn)
    : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const syllabusList = language === "en" ? training?.syllabusEn : training?.syllabusBn;
  const syllabus = syllabusList && syllabusList.length > 0 ? syllabusList : [];

  const certInfo = language === "en" ? training?.certificateInfoEn : training?.certificateInfoBn;
  const description = language === "en" ? training?.descriptionEn : training?.descriptionBn;
  const feeValue = training && training.fee > 0
    ? `৳${training.fee.toLocaleString()}`
    : (language === "en" ? "Contact us" : "যোগাযোগ করুন");

  const ct = training ? (CLASS_TYPE_LABELS[training.classType] ?? CLASS_TYPE_LABELS.offline) : null;

  const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!training) return;
    setSubmitting(true);
    setFormError("");
    try {
      const fd = new FormData(e.currentTarget);
      await api.post("/training-enrollments", {
        trainingId: training.id,
        name: fd.get("name"),
        phone: fd.get("phone"),
        email: fd.get("email") || undefined,
        address: fd.get("address") || undefined,
        education: fd.get("education") || undefined,
        message: fd.get("message") || undefined,
      });
      setEnrolled(true);
    } catch {
      setFormError(language === "en" ? "Submission failed. Please try again." : "জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title={title} />
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

            {/* ── Left: Course Details ── */}
            <div className="lg:col-span-2">

              {/* Image + Duration card side by side */}
              <div className="flex gap-4 mb-8">
                {training?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={training.image} alt={title} className="w-1/2 aspect-4/3 object-cover rounded-2xl shrink-0" />
                )}
                <Card className="flex-1 p-5 flex flex-col justify-center gap-3">
                  <h3 className="font-bold text-sm" style={{ color: PRIMARY }}>
                    {language === "en" ? "Course Duration" : "কোর্সের মেয়াদ"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Clock size={15} className="text-primary-600 shrink-0" />
                    <span className="text-slate-500 shrink-0">{language === "en" ? "Total Duration:" : "মোট মেয়াদ:"}</span>
                    <span className="font-semibold">{training?.duration || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CalendarDays size={15} className="text-primary-600 shrink-0" />
                    <span className="text-slate-500 shrink-0">{language === "en" ? "Weekly Classes:" : "সাপ্তাহিক ক্লাস:"}</span>
                    <span className="font-semibold">{training?.weeklyClasses || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Timer size={15} className="text-primary-600 shrink-0" />
                    <span className="text-slate-500 shrink-0">{language === "en" ? "Total Hours:" : "মোট ঘণ্টা:"}</span>
                    <span className="font-semibold">{training?.totalHours || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle size={15} className="text-green-500 shrink-0" />
                    <span>{language === "en" ? "Practical Training Included" : "প্রায়োগিক প্রশিক্ষণ অন্তর্ভুক্ত"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle size={15} className="text-green-500 shrink-0" />
                    <span>{language === "en" ? "Final Assessment & Certification" : "সমাপনী মূল্যায়ন ও সার্টিফিকেশন"}</span>
                  </div>
                </Card>
              </div>

              {/* Fee, Certificate, Class Type — small cards in a row */}
              <div className="flex gap-3 mb-10">
                <Card className="flex-1 flex flex-col items-center gap-1 p-3">
                  <BadgeDollarSign size={18} className="text-primary-600" />
                  <p className="text-xs text-slate-500">{t.training.detail.fee}</p>
                  <p className="font-bold text-slate-900 text-sm">{feeValue}</p>
                </Card>
                <Card className="flex-1 flex flex-col items-center gap-1 p-3">
                  <Award size={18} className="text-primary-600" />
                  <p className="text-xs text-slate-500">{t.training.detail.certificate}</p>
                  <p className="font-bold text-slate-900 text-sm">{language === "en" ? "Yes" : "হ্যাঁ"}</p>
                </Card>
                <Card className="flex-1 flex flex-col items-center gap-1 p-3">
                  {training?.classType === "online" ? (
                    <Monitor size={18} className="text-primary-600" />
                  ) : (
                    <MapPin size={18} className="text-primary-600" />
                  )}
                  <p className="text-xs text-slate-500">{language === "en" ? "Class Type" : "ক্লাসের ধরন"}</p>
                  <p className="font-bold text-slate-900 text-sm">{ct ? (language === "en" ? ct.en : ct.bn) : "—"}</p>
                </Card>
              </div>

              {/* Description */}
              {description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>
                    {t.training.detail.courseDetails}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">{description}</p>
                </div>
              )}

              {/* Syllabus Modules */}
              {training?.syllabusModules && training.syllabusModules.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4" style={{ color: PRIMARY }}>{t.training.detail.syllabus}</h2>
                  <div className="flex flex-col gap-5">
                    {training.syllabusModules.map((mod, i) => (
                      <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
                        <div className="px-4 py-2.5 font-semibold text-sm text-white" style={{ backgroundColor: PRIMARY }}>
                          {language === "en" ? mod.titleEn : mod.titleBn}
                        </div>
                        <ul className="flex flex-col divide-y divide-slate-50">
                          {mod.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate Info */}
              <div className="rounded-xl border border-primary-100 bg-primary-50 p-5 flex items-start gap-4">
                <Award size={22} className="text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t.training.detail.certificate}</h3>
                  <p className="text-sm text-slate-600">
                    {certInfo || (language === "en"
                      ? "Upon completion, participants receive an official Nexivio Care certificate."
                      : "সম্পন্ন করার পর অংশগ্রহণকারীরা অফিসিয়াল নেক্সিভিও কেয়ার সার্টিফিকেট পাবেন।")}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: Enrollment Form ── */}
            <div>
              <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />
                <div className="p-6">
                  {enrolled ? (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                      <CheckCircle size={48} className="text-green-500" />
                      <p className="font-semibold text-slate-900">
                        {language === "en"
                          ? "Enrollment submitted! We will contact you soon."
                          : "আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-5">
                        <BookOpen size={20} style={{ color: ACCENT }} />
                        <h3 className="font-bold text-slate-900">
                          {language === "en" ? "Apply Now" : "ভর্তির আবেদন করুন"}
                        </h3>
                      </div>
                      <form onSubmit={handleEnroll} className="flex flex-col gap-3">
                        <input
                          name="name" required placeholder={language === "en" ? "Full Name *" : "পূর্ণ নাম *"}
                          className={inp}
                        />
                        <input
                          name="phone" required type="tel" placeholder={language === "en" ? "Phone Number *" : "ফোন নম্বর *"}
                          className={inp}
                        />
                        <input
                          name="email" type="email" placeholder={language === "en" ? "Email (optional)" : "ইমেইল (ঐচ্ছিক)"}
                          className={inp}
                        />
                        <input
                          name="address" placeholder={language === "en" ? "Address" : "ঠিকানা"}
                          className={inp}
                        />
                        <input
                          name="education" placeholder={language === "en" ? "Education" : "শিক্ষাগত যোগ্যতা"}
                          className={inp}
                        />
                        <textarea
                          name="message" rows={3} placeholder={language === "en" ? "Message (optional)" : "বার্তা (ঐচ্ছিক)"}
                          className={`${inp} resize-none`}
                        />
                        {formError && <p className="text-sm text-red-500">{formError}</p>}
                        <button
                          type="submit" disabled={submitting || !training}
                          className="w-full py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
                          style={{ backgroundColor: ACCENT }}
                        >
                          {submitting
                            ? (language === "en" ? "Submitting..." : "জমা হচ্ছে...")
                            : (language === "en" ? "Submit Application" : "আবেদন জমা দিন")}
                        </button>
                      </form>
                    </>
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

const inp = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300";
