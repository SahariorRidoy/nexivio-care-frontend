"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Phone, Clock, ShieldCheck, Star, CalendarDays, MapPin, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import type { Service, OtherService, ServicePackage } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import PaymentCard from "@/components/shared/PaymentCard";

const PRIMARY = "#0C2468";
const HEADER_IMAGE = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85&auto=format&fit=crop";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(11),
  address: z.string().min(5),
  patientName: z.string().min(2),
  patientGender: z.enum(["male", "female", "other"]),
  relationship: z.string().min(1),
  patientCondition: z.string().optional(),
  serviceType: z.string().min(1),
  packageName: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  paymentMethod: z.enum(["bkash", "card", "cash"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PAYMENT_METHODS = [
  { value: "bkash", label: "bKash",          color: "#e2136e", bg: "#fdf2f8" },
  { value: "card",  label: "Card",            color: "#1d4ed8", bg: "#eff6ff" },
  { value: "cash",  label: "Cash on Service", color: "#15803d", bg: "#f0fdf4" },
];

const WHY_ITEMS = [
  { icon: ShieldCheck, en: "Verified & trained staff",         bn: "যাচাইকৃত ও প্রশিক্ষিত কর্মী" },
  { icon: Clock,       en: "24/7 support available",           bn: "২৪/৭ সহায়তা সেবা" },
  { icon: Star,        en: "500+ satisfied families",          bn: "৫০০+ সন্তুষ্ট পরিবার" },
  { icon: ShieldCheck, en: "Affordable & transparent pricing", bn: "সাশ্রয়ী ও স্বচ্ছ মূল্য" },
];

type ServiceMap = Record<string, ServicePackage[]>;

type ServiceGroup = {
  groupEn: string;
  groupBn: string;
  items: { value: string; labelEn: string; labelBn: string }[];
};

const STATIC_SERVICE_GROUPS: ServiceGroup[] = [
  {
    groupEn: "Main Services",
    groupBn: "প্রধান সেবা",
    items: [
      { value: "physiotherapy-rehabilitation", labelEn: "Physiotherapy & Rehabilitation", labelBn: "ফিজিওথেরাপি ও পুনর্বাসন" },
      { value: "on-demand-nursing",            labelEn: "On-Demand Nursing",              labelBn: "অন-ডিমান্ড নার্সিং" },
      { value: "home-diagnostics",             labelEn: "Home Diagnostics",               labelBn: "হোম ডায়াগনস্টিক্স" },
    ],
  },
  {
    groupEn: "Additional Services",
    groupBn: "অতিরিক্ত সেবা",
    items: [
      { value: "doctor-consultation",       labelEn: "Doctor Consultation",         labelBn: "ডাক্তার পরামর্শ" },
      { value: "doctor-home-visit",         labelEn: "Doctor Home Visit",           labelBn: "ডাক্তার হোম ভিজিট" },
      { value: "medical-equipment",         labelEn: "Medical Equipment",           labelBn: "মেডিকেল সরঞ্জাম" },
      { value: "hospital-visit-assistance", labelEn: "Hospital Visit Assistance",   labelBn: "হাসপাতাল ভিজিট সহায়তা" },
      { value: "ambulance-service",         labelEn: "Ambulance Service",           labelBn: "অ্যাম্বুলেন্স সেবা" },
      { value: "other-support-services",    labelEn: "Other Support Services",      labelBn: "অন্যান্য সহায়তা সেবা" },
    ],
  },
];



function BookServiceInner() {
  const { t, language } = useLanguage();
  const s = useSettings();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [serviceGroups, setServiceGroups] = useState<{ label: string; options: { value: string; label: string }[] }[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [packagesMap, setPackagesMap] = useState<ServiceMap>({});
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [packageError, setPackageError] = useState<string>("");
  const [pricingPeriod, setPricingPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const isBn = language === "bn";
  const f = t.bookService.form;

  useEffect(() => {
    Promise.all([
      api.get<{ data: Service[] }>("/services").catch(() => ({ data: [] as Service[] })),
      api.get<{ data: OtherService[] }>("/other-services").catch(() => ({ data: [] as OtherService[] })),
    ]).then(([sRes, oRes]) => {
      const map: ServiceMap = {};

      const parsePkgs = (raw: unknown): ServicePackage[] => {
        if (!raw) return [];
        const arr = Array.isArray(raw) ? raw : [];
        return arr.filter((p) => p && typeof p === "object" && "dailyPrice" in p) as ServicePackage[];
      };

      const mainItems: { value: string; label: string }[] = [];
      const additionalItems: { value: string; label: string }[] = [];

      sRes.data.filter((s) => s.isActive).forEach((s) => {
        mainItems.push({ value: s.slug, label: isBn ? s.nameBn : s.nameEn });
        const pkgs = parsePkgs(s.packages);
        if (pkgs.length) map[s.slug] = pkgs;
      });
      oRes.data.filter((s) => s.isActive).forEach((s) => {
        additionalItems.push({ value: s.slug, label: isBn ? s.nameBn : s.nameEn });
        const pkgs = parsePkgs(s.packages);
        if (pkgs.length) map[s.slug] = pkgs;
      });

      const allDynamicSlugs = new Set([...mainItems, ...additionalItems].map((o) => o.value));

      // Append static items that aren't already from API, into their respective groups
      STATIC_SERVICE_GROUPS[0].items.forEach((s) => {
        if (!allDynamicSlugs.has(s.value))
          mainItems.push({ value: s.value, label: isBn ? s.labelBn : s.labelEn });
      });
      STATIC_SERVICE_GROUPS[1].items.forEach((s) => {
        if (!allDynamicSlugs.has(s.value))
          additionalItems.push({ value: s.value, label: isBn ? s.labelBn : s.labelEn });
      });

      const groups: { label: string; options: { value: string; label: string }[] }[] = [];
      if (mainItems.length)
        groups.push({ label: isBn ? "প্রধান সেবা" : "Main Services", options: mainItems });
      if (additionalItems.length)
        groups.push({ label: isBn ? "অতিরিক্ত সেবা" : "Additional Services", options: additionalItems });

      setServiceGroups(groups);
      setPackagesMap(map);
      setServicesLoading(false);
    });
  }, [isBn]);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [selectedService, setSelectedService] = useState<string>(preselected);
  const currentPackages = (selectedService && packagesMap[selectedService]) || [];

  // Pre-select service from query param once services are loaded
  useEffect(() => {
    if (preselected && !servicesLoading) {
      setValue("serviceType", preselected);
      setSelectedService(preselected);
    }
  }, [preselected, servicesLoading, setValue]);

  // Reset package when service changes
  useEffect(() => {
    setSelectedPackage(null);
    setPackageError("");
    setValue("packageName", undefined);
  }, [selectedService, setValue]);

  const onSubmit = async (data: FormData) => {
    if (currentPackages.length > 0 && !selectedPackage) {
      setPackageError(isBn ? "অনুগ্রহ করে একটি প্যাকেজ বেছে নিন" : "Please select a package");
      return;
    }
    const amount = selectedPackage
      ? pricingPeriod === "daily" ? selectedPackage.dailyPrice
      : pricingPeriod === "weekly" ? selectedPackage.weeklyPrice
      : selectedPackage.monthlyPrice
      : 0;

    const booking = await api.post<{ data: { id: string } }>("/bookings", {
      ...data,
      packageName: selectedPackage ? (isBn ? selectedPackage.nameBn : selectedPackage.nameEn) : undefined,
      pricingPeriod: selectedPackage ? pricingPeriod : undefined,
      amount,
      paymentStatus: data.paymentMethod === "cash" ? "unpaid" : "pending",
    });

    if (data.paymentMethod === "bkash") {
      const callbackUrl = `${window.location.origin}/bkash-callback`;
      const res = await api.post<{ data: { bkashURL: string } }>("/bkash/create-payment", {
        amount: String(amount || 100),
        bookingId: booking.data.id,
        callbackUrl,
      });
      window.location.href = res.data.bkashURL;
      return;
    }

    toast.success(isBn ? "বুকিং সফলভাবে জমা হয়েছে!" : "Booking submitted successfully!");
    reset();
    setSelectedPayment("");
    setSelectedPackage(null);
    setSelectedService("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {isBn ? "বুকিং সফলভাবে জমা হয়েছে!" : "Booking Submitted!"}
        </h2>
        <p className="text-slate-500 max-w-sm text-sm">{t.bookService.success}</p>
        <button onClick={() => setSubmitted(false)} className="mt-2 cursor-pointer text-sm font-semibold underline" style={{ color: PRIMARY }}>
          {isBn ? "আরেকটি বুকিং করুন" : "Make another booking"}
        </button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t.bookService.title} subtitle={t.bookService.subtitle} bgImage={HEADER_IMAGE} />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Left sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: PRIMARY }} />
                <div className="p-6">
                  <h2 className="text-base font-bold mb-4" style={{ color: PRIMARY }}>
                    {isBn ? "কেন আমাদের বেছে নেবেন?" : "Why Choose Nexivio Care?"}
                  </h2>
                  <ul className="flex flex-col gap-4">
                    {WHY_ITEMS.map(({ icon: Icon, en, bn }) => (
                      <li key={en} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-50">
                          <Icon size={15} style={{ color: PRIMARY }} />
                        </div>
                        <span className="text-sm text-slate-700">{isBn ? bn : en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #163080 100%)` }}>
                <h3 className="font-bold text-base mb-1">{isBn ? "সরাসরি কথা বলুন" : "Talk to Us Directly"}</h3>
                <p className="text-blue-200 text-sm mb-4">
                  {isBn ? "বুকিং সম্পর্কে যেকোনো প্রশ্নে কল করুন।" : "Call us for any booking queries."}
                </p>
                <a href={`tel:${s.phone}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg text-sm font-semibold">
                  <Phone size={14} /> {s.phone}
                </a>
                {s.phone2 && (
                  <a href={`tel:${s.phone2}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg text-sm font-semibold">
                    <Phone size={14} /> {s.phone2}
                  </a>
                )}
              </div>

              <PaymentCard />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: CalendarDays, en: "Same day booking", bn: "একই দিনে বুকিং" },
                  { icon: MapPin,       en: "Dhaka & nearby",   bn: "ঢাকা ও আশেপাশে" },
                ].map(({ icon: Icon, en, bn }) => (
                  <div key={en} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <Icon size={16} style={{ color: PRIMARY }} />
                    <span className="text-xs font-medium text-slate-700">{isBn ? bn : en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full" style={{ backgroundColor: "#2563eb" }} />
              <div className="p-8">
                <h2 className="text-lg font-bold mb-6" style={{ color: PRIMARY }}>
                  {isBn ? "বুকিং ফর্ম পূরণ করুন" : "Fill in Booking Details"}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label={f.name} required error={errors.name?.message} {...register("name")} />
                    <Input label={f.phone} type="tel" required error={errors.phone?.message} {...register("phone")} />
                  </div>

                  <Input label={f.address} required error={errors.address?.message} {...register("address")} />

                  {/* Patient Info */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: PRIMARY }}>
                      {isBn ? "রোগীর তথ্য" : "Patient Information"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label={f.patientName}
                        required
                        error={errors.patientName?.message}
                        {...register("patientName")}
                      />
                      <Select
                        label={f.patientGender}
                        required
                        options={[
                          { value: "male",   label: isBn ? "পুরুষ"  : "Male"   },
                          { value: "female", label: isBn ? "মহিলা" : "Female" },
                          { value: "other",  label: isBn ? "অন্যান্য" : "Other" },
                        ]}
                        placeholder={isBn ? "— লিঙ্গ —" : "— Gender —"}
                        error={errors.patientGender?.message}
                        {...register("patientGender")}
                      />
                      <Select
                        label={f.relationship}
                        required
                        options={[
                          { value: "self",    label: isBn ? "নিজে"      : "Self"        },
                          { value: "son",     label: isBn ? "ছেলে"      : "Son"         },
                          { value: "daughter",label: isBn ? "মেয়ে"      : "Daughter"    },
                          { value: "spouse",  label: isBn ? "স্বামী/স্ত্রী" : "Spouse"  },
                          { value: "parent",  label: isBn ? "বাবা/মা"   : "Parent"      },
                          { value: "sibling", label: isBn ? "ভাই/বোন"  : "Sibling"     },
                          { value: "other",   label: isBn ? "অন্যান্য" : "Other"        },
                        ]}
                        placeholder={isBn ? "— সম্পর্ক —" : "— Relationship —"}
                        error={errors.relationship?.message}
                        {...register("relationship")}
                      />
                    </div>
                    <Textarea
                      label={f.patientCondition}
                      rows={2}
                      {...register("patientCondition")}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">
                      {f.serviceType} <span className="text-red-500">*</span>
                    </label>
                    <select
                      defaultValue={preselected || ""}
                      disabled={servicesLoading}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors cursor-pointer focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50"
                      {...register("serviceType")}
                      onChange={(e) => {
                        register("serviceType").onChange(e);
                        setSelectedService(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        {servicesLoading ? (isBn ? "লোড হচ্ছে..." : "Loading...") : (isBn ? "— সেবা বেছে নিন —" : "— Select Service —")}
                      </option>
                      {serviceGroups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {errors.serviceType && <p className="text-xs text-red-500">{errors.serviceType.message}</p>}
                  </div>

                  {/* Package selection */}
                  {currentPackages.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">
                          {isBn ? "প্যাকেজ বেছে নিন" : "Select Package"} <span className="text-red-500">*</span>
                        </label>
                        {/* Pricing period toggle */}
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
                          {(["daily", "weekly", "monthly"] as const).map((period) => (
                            <button
                              key={period}
                              type="button"
                              onClick={() => setPricingPeriod(period)}
                              className="px-3 py-1.5 transition-all"
                              style={pricingPeriod === period
                                ? { backgroundColor: PRIMARY, color: "#fff" }
                                : { backgroundColor: "#fff", color: "#64748b" }
                              }
                            >
                              {period === "daily"
                                ? (isBn ? "দৈনিক" : "Daily")
                                : period === "weekly"
                                ? (isBn ? "সাপ্তাহিক" : "Weekly")
                                : (isBn ? "মাসিক" : "Monthly")}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {currentPackages.map((pkg) => {
                          const isSelected = selectedPackage?.tier === pkg.tier;
                          const price = pricingPeriod === "daily" ? pkg.dailyPrice : pricingPeriod === "weekly" ? pkg.weeklyPrice : pkg.monthlyPrice;
                          const periodLabel = pricingPeriod === "daily" ? (isBn ? "দিন" : "day") : pricingPeriod === "weekly" ? (isBn ? "সপ্তাহ" : "week") : (isBn ? "মাস" : "month");
                          return (
                            <button
                              key={pkg.tier}
                              type="button"
                              onClick={() => {
                                setSelectedPackage(pkg);
                                setPackageError("");
                                setValue("packageName", isBn ? pkg.nameBn : pkg.nameEn);
                              }}
                              className="flex flex-col gap-1 p-4 rounded-xl border-2 text-left transition-all"
                              style={isSelected
                                ? { borderColor: PRIMARY, backgroundColor: "#dbeafe", boxShadow: `0 0 0 3px ${PRIMARY}22` }
                                : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                              }
                            >
                              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: isSelected ? PRIMARY : "#64748b" }}>
                                {isBn ? pkg.nameBn : pkg.nameEn}
                              </span>
                              {(isBn ? pkg.descriptionBn : pkg.descriptionEn) && (
                                <span className="text-xs text-slate-400 leading-tight">
                                  {isBn ? pkg.descriptionBn : pkg.descriptionEn}
                                </span>
                              )}
                              <span
                                className="mt-1 inline-flex items-baseline gap-0.5 rounded-lg px-2 py-1 text-lg font-extrabold"
                                style={isSelected
                                  ? { backgroundColor: PRIMARY, color: "#fff" }
                                  : { backgroundColor: "#f1f5f9", color: PRIMARY }
                                }
                              >
                                ৳{price.toLocaleString()}
                                <span className="text-[10px] font-normal" style={{ color: isSelected ? "#bfdbfe" : "#94a3b8" }}>/{periodLabel}</span>
                              </span>
                              <span className="text-xs text-slate-500">{pkg.dutyHours}h {isBn ? "ডিউটি" : "duty"}</span>
                            </button>
                          );
                        })}
                      </div>

                      {packageError && <p className="text-xs text-red-500">{packageError}</p>}

                      {/* Selected package amount summary */}
                      {selectedPackage && (
                        <div className="mt-1 flex items-center justify-between rounded-xl px-4 py-3 border-2" style={{ backgroundColor: PRIMARY, borderColor: PRIMARY }}>
                          <span className="text-sm font-semibold text-white">
                            {isBn ? "নির্বাচিত প্যাকেজ:" : "Selected:"} <span className="opacity-80">{isBn ? selectedPackage.nameBn : selectedPackage.nameEn}</span>
                          </span>
                          <span className="text-lg font-extrabold text-white">
                            ৳{(pricingPeriod === "daily" ? selectedPackage.dailyPrice : pricingPeriod === "weekly" ? selectedPackage.weeklyPrice : selectedPackage.monthlyPrice).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Input label={f.date} type="date" required error={errors.date?.message} {...register("date")} />
                    <Input label={f.time} type="time" required error={errors.time?.message} {...register("time")} />
                  </div>

                  {/* Payment method */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">
                      {f.paymentMethod} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map(({ value, label, color, bg }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setSelectedPayment(value);
                            setValue("paymentMethod", value as FormData["paymentMethod"], { shouldValidate: true });
                          }}
                          className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all"
                          style={selectedPayment === value
                            ? { borderColor: color, backgroundColor: bg, color }
                            : { borderColor: "#e2e8f0", backgroundColor: "#fff", color: "#64748b" }
                          }
                        >
                          <CreditCard size={16} style={{ color: selectedPayment === value ? color : "#94a3b8" }} />
                          {label}
                        </button>
                      ))}
                    </div>
                    {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>}
                    <input type="hidden" {...register("paymentMethod")} />
                  </div>

                  <Textarea label={f.notes} rows={3} {...register("notes")} />

                  <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                    {selectedPayment === "bkash"
                      ? (isBn ? "bKash দিয়ে পেমেন্ট করুন" : "Pay with bKash")
                      : f.submit}
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

export default function BookServiceContent() {
  return (
    <Suspense>
      <BookServiceInner />
    </Suspense>
  );
}
