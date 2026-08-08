"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import Spinner from "@/components/ui/Spinner";
import ServicePackageCards, { slugColor } from "@/components/shared/ServicePackageCards";
import type { OtherService } from "@/types";

const PRIMARY = "#0C2468";
const WHATSAPP_NUMBER = "8801XXXXXXXXX"; // replace with real number

type EquipmentItem = { nameEn: string; nameBn: string; image: string };
type EquipmentCategory = { titleEn: string; titleBn: string; items: EquipmentItem[] };

const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    titleEn: "Respiratory Care", titleBn: "শ্বাসযন্ত্রের সেবা",
    items: [
      { nameEn: "Oxygen Concentrator", nameBn: "অক্সিজেন কনসেন্ট্রেটর", image: "/oxygen concentrator.webp" },
      { nameEn: "Nebulizer",           nameBn: "নেবুলাইজার",            image: "/nebulizer.webp" },
      { nameEn: "Pulse Oximeter",      nameBn: "পালস অক্সিমিটার",       image: "/pulse oximeter.png" },
      { nameEn: "Steamer",             nameBn: "স্টিমার",               image: "/streamer.webp" },
      { nameEn: "CPAP",                nameBn: "সিপ্যাপ",               image: "/cpap.webp" },
      { nameEn: "BiPAP Machine",       nameBn: "বাইপ্যাপ মেশিন",        image: "/bipap.webp" },
    ],
  },
  {
    titleEn: "Wellness & Care", titleBn: "সুস্থতা ও সেবা",
    items: [
      { nameEn: "Blood Pressure Machine", nameBn: "ব্লাড প্রেশার মেশিন",  image: "/blood pressure machine.jpg" },
      { nameEn: "Digital BP Monitor",     nameBn: "ডিজিটাল বিপি মনিটর",  image: "/Digital bp machine.webp" },
      { nameEn: "Glucometer",             nameBn: "গ্লুকোমিটার",          image: "/glucometer.webp" },
      { nameEn: "Suction Machine",        nameBn: "সাকশন মেশিন",         image: "/suction machine .webp" },
      { nameEn: "Face Mask",              nameBn: "ফেস মাস্ক",            image: "/face mask.webp" },
      { nameEn: "Adult Diapers",          nameBn: "অ্যাডাল্ট ডায়াপার",   image: "/adult diapers.webp" },
      { nameEn: "PPE / IPC Kits",         nameBn: "পিপিই / আইপিসি কিট",  image: "/ppe kit.webp" },
    ],
  },
  {
    titleEn: "Hospital Beds & Air Mattresses", titleBn: "হাসপাতাল বেড ও এয়ার ম্যাট্রেস",
    items: [
      { nameEn: "Manual / Electric Beds",     nameBn: "ম্যানুয়াল / ইলেকট্রিক বেড",  image: "/Manual  Electric Beds.webp" },
      { nameEn: "High-Quality Hospital Beds", nameBn: "উচ্চমানের হাসপাতাল বেড",       image: "/High-Quality Hospital Beds.webp" },
      { nameEn: "3 or 5 Functional Beds",     nameBn: "৩ বা ৫ ফাংশনাল বেড",           image: "/3 or 5 Functional Beds.webp" },
      { nameEn: "Anti-Bedsore Mattresses",    nameBn: "অ্যান্টি-বেডসোর ম্যাট্রেস",    image: "/Anti-Bedsore Mattresses.webp" },
    ],
  },
  {
    titleEn: "Mobility", titleBn: "গতিশীলতা সহায়ক",
    items: [
      { nameEn: "Wheelchair",         nameBn: "হুইলচেয়ার",         image: "/Wheelchair.webp" },
      { nameEn: "Monopod Stick",      nameBn: "মনোপড স্টিক",       image: "/Monopod Stick.webp" },
      { nameEn: "Quadruped Stick",    nameBn: "কোয়াড্রুপেড স্টিক", image: "/Quadruped Stick.webp" },
      { nameEn: "Walkers",            nameBn: "ওয়াকার",            image: "/Walkers.webp" },
      { nameEn: "Under Arm Crutches", nameBn: "আন্ডার আর্ম ক্রাচ", image: "/Under Arm Crutches.webp" },
    ],
  },
  {
    titleEn: "Bathroom Accessories", titleBn: "বাথরুম আনুষাঙ্গিক",
    items: [
      { nameEn: "Commode Chair", nameBn: "কমোড চেয়ার",   image: "/Commode Chair.webp" },
      { nameEn: "Toilet Raiser", nameBn: "টয়লেট রেইজার", image: "/Toilet Raiser.webp" },
      { nameEn: "Urinal Pot",    nameBn: "ইউরিনাল পট",    image: "/Urinal Pot.webp" },
      { nameEn: "Bed Pan",       nameBn: "বেড প্যান",      image: "/Bed Pan.webp" },
      { nameEn: "Shower Chair",  nameBn: "শাওয়ার চেয়ার",  image: "/Shower Chair.webp" },
    ],
  },
  {
    titleEn: "Orthopedics Care", titleBn: "অর্থোপেডিক সেবা",
    items: [
      { nameEn: "Heating Pad / Belt",   nameBn: "হিটিং প্যাড / বেল্ট",   image: "/Heating Pad - Belt.webp" },
      { nameEn: "LS Belt",              nameBn: "এলএস বেল্ট",             image: "/LS Belt.webp" },
      { nameEn: "Knee Cap",             nameBn: "নি ক্যাপ",               image: "/Knee Cap.webp" },
      { nameEn: "Shoulder Arm Support", nameBn: "শোল্ডার আর্ম সাপোর্ট",  image: "/Shoulder Arm Support.webp" },
      { nameEn: "Recliner",             nameBn: "রিক্লাইনার",             image: "/Recliner.webp" },
    ],
  },
];

function MedicalEquipmentShowcase({ language }: { language: string }) {
  return (
    <div className="flex flex-col gap-12">
      {EQUIPMENT_CATEGORIES.map((cat) => (
        <div key={cat.titleEn}>
          <h2 className="text-xl font-bold mb-5 pb-2 border-b-2" style={{ color: PRIMARY, borderColor: PRIMARY }}>
            {language === "en" ? cat.titleEn : cat.titleBn}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cat.items.map((item) => (
              <div key={item.nameEn} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-36 w-full">
                  <Image src={item.image} alt={item.nameEn} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-center" style={{ color: PRIMARY }}>
                    {language === "en" ? item.nameEn : item.nameBn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const STATIC_OTHER_SERVICE_DATA: Record<string, {
  nameEn: string; nameBn: string;
  shortDescEn: string; shortDescBn: string;
  descriptionEn: string; descriptionBn: string;
  image: string;
}> = {
  "doctor-consultation": {
    nameEn: "Doctor Consultation",
    nameBn: "ডাক্তার পরামর্শ",
    shortDescEn: "Online and in-person doctor consultation services at your convenience.",
    shortDescBn: "আপনার সুবিধামতো অনলাইন ও সরাসরি ডাক্তার পরামর্শ সেবা।",
    descriptionEn: `Nexivio Care connects you with qualified and experienced doctors for both online and in-person consultations. Whether you need a quick second opinion or a thorough check-up, our platform makes it easy to access the right specialist.

Our consultation services include:
• General physician consultations
• Specialist referrals (cardiology, neurology, orthopedics, and more)
• Online video and audio consultations
• In-person clinic visit arrangements
• Follow-up consultations and prescription renewals
• Chronic disease management consultations
• Pediatric and geriatric consultations

All doctors on our platform are registered and verified. Appointments can be booked same-day and our team assists with scheduling, reminders, and follow-ups to ensure continuity of care.`,
    descriptionBn: `নেক্সিভিও কেয়ার আপনাকে অনলাইন ও সরাসরি উভয় পরামর্শের জন্য যোগ্য ও অভিজ্ঞ ডাক্তারদের সাথে সংযুক্ত করে। দ্রুত দ্বিতীয় মতামত বা পুঙ্খানুপুঙ্খ পরীক্ষা যাই হোক, আমাদের প্ল্যাটফর্ম সঠিক বিশেষজ্ঞের কাছে পৌঁছানো সহজ করে তোলে।

আমাদের পরামর্শ সেবাসমূহ:
• সাধারণ চিকিৎসক পরামর্শ
• বিশেষজ্ঞ রেফারেল (কার্ডিওলজি, নিউরোলজি, অর্থোপেডিক্স ইত্যাদি)
• অনলাইন ভিডিও ও অডিও পরামর্শ
• সরাসরি ক্লিনিক ভিজিটের ব্যবস্থা
• ফলো-আপ পরামর্শ ও প্রেসক্রিপশন নবায়ন
• দীর্ঘস্থায়ী রোগ ব্যবস্থাপনা পরামর্শ
• শিশু ও বয়স্কদের পরামর্শ

আমাদের প্ল্যাটফর্মের সকল ডাক্তার নিবন্ধিত ও যাচাইকৃত। একই দিনে অ্যাপয়েন্টমেন্ট বুক করা যায় এবং আমাদের টিম সময়সূচি, রিমাইন্ডার ও ফলো-আপে সহায়তা করে।`,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop",
  },
  "doctor-home-visit": {
    nameEn: "Doctor Home Visit",
    nameBn: "ডাক্তার হোম ভিজিট",
    shortDescEn: "Qualified doctors visiting your home for check-ups and treatment.",
    shortDescBn: "যোগ্য ডাক্তার পরীক্ষা ও চিকিৎসার জন্য আপনার বাড়িতে আসবেন।",
    descriptionEn: `Nexivio Care brings qualified doctors directly to your home, eliminating the need to travel when you or your loved ones are unwell. Our home visit service is ideal for patients who are elderly, bedridden, or simply prefer the comfort of receiving care at home.

What our doctor home visit includes:
• Physical examination and diagnosis
• Prescription and medication guidance
• Chronic disease monitoring (diabetes, hypertension, etc.)
• Post-hospitalization follow-up visits
• Pediatric home visits for children
• Geriatric care for elderly patients
• Emergency home visits available

Our doctors arrive fully equipped with basic diagnostic tools. Visits can be scheduled in advance or arranged on short notice. We ensure punctuality and professional conduct at every visit.`,
    descriptionBn: `নেক্সিভিও কেয়ার যোগ্য ডাক্তারদের সরাসরি আপনার বাড়িতে নিয়ে আসে, যাতে আপনি বা আপনার প্রিয়জন অসুস্থ থাকলে ভ্রমণের প্রয়োজন না হয়। আমাদের হোম ভিজিট সেবা বয়স্ক, শয্যাশায়ী বা বাড়িতে সেবা নিতে পছন্দ করেন এমন রোগীদের জন্য আদর্শ।

আমাদের ডাক্তার হোম ভিজিটে যা অন্তর্ভুক্ত:
• শারীরিক পরীক্ষা ও রোগ নির্ণয়
• প্রেসক্রিপশন ও ওষুধ নির্দেশনা
• দীর্ঘস্থায়ী রোগ পর্যবেক্ষণ (ডায়াবেটিস, উচ্চ রক্তচাপ ইত্যাদি)
• হাসপাতাল থেকে ছাড়ার পর ফলো-আপ ভিজিট
• শিশুদের জন্য পেডিয়াট্রিক হোম ভিজিট
• বয়স্কদের জন্য জেরিয়াট্রিক সেবা
• জরুরি হোম ভিজিটের সুবিধা

আমাদের ডাক্তাররা মৌলিক ডায়াগনস্টিক সরঞ্জাম নিয়ে আসেন। আগে থেকে বা স্বল্প নোটিশে ভিজিট নির্ধারণ করা যায়।`,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop",
  },
  "medical-equipment": {
    nameEn: "Medical Equipment",
    nameBn: "মেডিকেল সরঞ্জাম",
    shortDescEn: "Rental and supply of home medical equipment for patient care.",
    shortDescBn: "রোগীর সেবার জন্য হোম মেডিকেল সরঞ্জাম ভাড়া ও সরবরাহ।",
    descriptionEn: "Nexivio Care provides a wide range of medical equipment for home use — available for both rental and purchase. All equipment is sanitized, tested, and delivered to your home with setup assistance.",
    descriptionBn: "নেক্সিভিও কেয়ার বাড়িতে ব্যবহারের জন্য বিস্তৃত মেডিকেল সরঞ্জাম সরবরাহ করে — ভাড়া ও ক্রয় উভয়ই পাওয়া যায়। সকল সরঞ্জাম স্যানিটাইজ, পরীক্ষিত এবং সেটআপ সহায়তাসহ আপনার বাড়িতে ডেলিভারি করা হয়।",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop",
  },
  "hospital-visit-assistance": {
    nameEn: "Hospital Visit Assistance",
    nameBn: "হাসপাতাল ভিজিট সহায়তা",
    shortDescEn: "Professional assistance and escort for hospital appointments and admissions.",
    shortDescBn: "হাসপাতালের অ্যাপয়েন্টমেন্ট ও ভর্তিতে পেশাদার সহায়তা ও সঙ্গ।",
    descriptionEn: `Nexivio Care's Hospital Visit Assistance service ensures that patients — especially the elderly and those without family support — can attend hospital appointments safely and with confidence. Our trained attendants accompany patients from home to hospital and back.

Our assistance covers:
• Escort from home to hospital and return
• Appointment booking and queue management
• Assistance with hospital registration and paperwork
• Accompanying patients during consultations
• Coordination with doctors and hospital staff
• Post-visit report collection and delivery
• Admission and discharge assistance
• Interpreter services for non-Bengali speaking patients

Our attendants are trained in patient handling, communication, and basic first aid. We ensure a stress-free hospital experience for patients and peace of mind for their families.`,
    descriptionBn: `নেক্সিভিও কেয়ারের হাসপাতাল ভিজিট সহায়তা সেবা নিশ্চিত করে যে রোগীরা — বিশেষত বয়স্ক ও পারিবারিক সহায়তাহীনরা — নিরাপদে ও আত্মবিশ্বাসের সাথে হাসপাতালের অ্যাপয়েন্টমেন্টে যেতে পারেন। আমাদের প্রশিক্ষিত অ্যাটেন্ডেন্টরা বাড়ি থেকে হাসপাতাল এবং ফিরে আসা পর্যন্ত রোগীর সাথে থাকেন।

আমাদের সহায়তায় যা অন্তর্ভুক্ত:
• বাড়ি থেকে হাসপাতাল ও ফিরে আসার সঙ্গ
• অ্যাপয়েন্টমেন্ট বুকিং ও কিউ ব্যবস্থাপনা
• হাসপাতাল নিবন্ধন ও কাগজপত্রে সহায়তা
• পরামর্শের সময় রোগীর সাথে থাকা
• ডাক্তার ও হাসপাতাল কর্মীদের সাথে সমন্বয়
• ভিজিট পরবর্তী রিপোর্ট সংগ্রহ ও ডেলিভারি
• ভর্তি ও ছাড়পত্র সহায়তা
• অ-বাংলাভাষী রোগীদের জন্য দোভাষী সেবা`,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
  },
  "ambulance-service": {
    nameEn: "Ambulance Service",
    nameBn: "অ্যাম্বুলেন্স সেবা",
    shortDescEn: "24/7 ambulance service for emergencies and non-emergency medical transport.",
    shortDescBn: "জরুরি ও অ-জরুরি চিকিৎসা পরিবহনের জন্য ২৪/৭ অ্যাম্বুলেন্স সেবা।",
    descriptionEn: `Nexivio Care operates a reliable ambulance service available 24 hours a day, 7 days a week. Whether it's a medical emergency or a planned hospital transfer, our fleet of well-equipped ambulances ensures safe and timely transport.

Our ambulance service includes:
• Emergency ambulance dispatch (24/7)
• Basic Life Support (BLS) ambulances
• Advanced Life Support (ALS) ambulances with ICU equipment
• Non-emergency patient transport
• Inter-hospital transfers
• Airport and long-distance medical transport
• Trained paramedics and EMTs on board
• Oxygen, defibrillator, and emergency medications available

Our dispatch team responds quickly to calls and coordinates with hospitals to ensure seamless handover. All vehicles are GPS-tracked and regularly maintained for reliability and safety.`,
    descriptionBn: `নেক্সিভিও কেয়ার সপ্তাহের ৭ দিন ২৪ ঘণ্টা নির্ভরযোগ্য অ্যাম্বুলেন্স সেবা পরিচালনা করে। চিকিৎসা জরুরি অবস্থা বা পরিকল্পিত হাসপাতাল স্থানান্তর যাই হোক, আমাদের সুসজ্জিত অ্যাম্বুলেন্স বহর নিরাপদ ও সময়মতো পরিবহন নিশ্চিত করে।

আমাদের অ্যাম্বুলেন্স সেবায় যা অন্তর্ভুক্ত:
• জরুরি অ্যাম্বুলেন্স ডিসপ্যাচ (২৪/৭)
• বেসিক লাইফ সাপোর্ট (BLS) অ্যাম্বুলেন্স
• আইসিইউ সরঞ্জামসহ অ্যাডভান্সড লাইফ সাপোর্ট (ALS) অ্যাম্বুলেন্স
• অ-জরুরি রোগী পরিবহন
• আন্তঃহাসপাতাল স্থানান্তর
• বিমানবন্দর ও দূরপাল্লার চিকিৎসা পরিবহন
• প্রশিক্ষিত প্যারামেডিক ও EMT সহ
• অক্সিজেন, ডিফিব্রিলেটর ও জরুরি ওষুধ উপলব্ধ

আমাদের ডিসপ্যাচ টিম দ্রুত কলে সাড়া দেয় এবং নিরবচ্ছিন্ন হস্তান্তর নিশ্চিত করতে হাসপাতালের সাথে সমন্বয় করে।`,
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&auto=format&fit=crop",
  },
  "other-support-services": {
    nameEn: "Other Support Services",
    nameBn: "অন্যান্য সহায়তা সেবা",
    shortDescEn: "Additional support services tailored to your unique healthcare needs.",
    shortDescBn: "আপনার অনন্য স্বাস্থ্যসেবার প্রয়োজন অনুযায়ী অতিরিক্ত সহায়তা সেবা।",
    descriptionEn: `Nexivio Care understands that healthcare needs don't always fit neatly into standard categories. Our Other Support Services are designed to fill the gaps — providing flexible, personalized assistance for a wide range of situations.

Services we offer under this category:
• Caregiver and attendant placement for long-term home care
• Medicine procurement and home delivery
• Health record management and digital filing
• Appointment scheduling and reminder services
• Post-discharge care coordination
• Mental health and counseling referrals
• Nutritional guidance and diet planning support
• Elderly companionship and social support services

Our team works closely with patients and families to understand their specific needs and design a support plan that works for them. No request is too small — we are here to help at every step of the healthcare journey.`,
    descriptionBn: `নেক্সিভিও কেয়ার বোঝে যে স্বাস্থ্যসেবার প্রয়োজন সবসময় মানক বিভাগে পড়ে না। আমাদের অন্যান্য সহায়তা সেবা ফাঁকগুলো পূরণ করতে ডিজাইন করা হয়েছে — বিভিন্ন পরিস্থিতির জন্য নমনীয়, ব্যক্তিগতকৃত সহায়তা প্রদান করে।

এই বিভাগে আমরা যে সেবা অফার করি:
• দীর্ঘমেয়াদী হোম কেয়ারের জন্য কেয়ারগিভার ও অ্যাটেন্ডেন্ট নিয়োগ
• ওষুধ সংগ্রহ ও হোম ডেলিভারি
• স্বাস্থ্য রেকর্ড ব্যবস্থাপনা ও ডিজিটাল ফাইলিং
• অ্যাপয়েন্টমেন্ট নির্ধারণ ও রিমাইন্ডার সেবা
• হাসপাতাল থেকে ছাড়ার পর সেবা সমন্বয়
• মানসিক স্বাস্থ্য ও কাউন্সেলিং রেফারেল
• পুষ্টি নির্দেশনা ও ডায়েট পরিকল্পনা সহায়তা
• বয়স্কদের সঙ্গ ও সামাজিক সহায়তা সেবা

আমাদের টিম রোগী ও পরিবারের সাথে ঘনিষ্ঠভাবে কাজ করে তাদের নির্দিষ্ট প্রয়োজন বুঝতে এবং তাদের জন্য কার্যকর সহায়তা পরিকল্পনা তৈরি করতে।`,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
  },
};

const STATIC_SLUGS = new Set(Object.keys(STATIC_OTHER_SERVICE_DATA));

export default function OtherServiceDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const [service, setService] = useState<OtherService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (STATIC_SLUGS.has(slug)) { setLoading(false); return; }
    api.get<{ data: OtherService }>(`/other-services/${slug}`)
      .then((r) => setService(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center py-32"><Spinner /></div>;

  const isStatic = STATIC_SLUGS.has(slug);
  const staticData = STATIC_OTHER_SERVICE_DATA[slug];

  const color = slugColor(slug);
  const title = isStatic
    ? (language === "en" ? staticData.nameEn : staticData.nameBn)
    : service
      ? (language === "en" ? service.nameEn : service.nameBn)
      : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const subtitle = isStatic
    ? (language === "en" ? staticData.shortDescEn : staticData.shortDescBn)
    : (language === "en" ? service?.shortDescEn : service?.shortDescBn) ?? "";
  const description = isStatic
    ? (language === "en" ? staticData.descriptionEn : staticData.descriptionBn)
    : (language === "en" ? service?.descriptionEn : service?.descriptionBn) ?? "";
  const image = isStatic ? staticData.image : service?.image ?? "";
  const packages = isStatic ? [] : (service?.packages ?? []);

  const isMedicalEquipment = slug === "medical-equipment";

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} bgImage={image || undefined} bgColor={color} />
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col gap-14">

          {/* Short description + CTA */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {image && !isMedicalEquipment && (
              <div className="relative w-full lg:w-96 h-64 rounded-2xl overflow-hidden shrink-0 shadow">
                <Image src={image} alt={title} fill className="object-cover" />
              </div>
            )}
            {description && (
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>
                  {language === "en" ? "About This Service" : "এই সেবা সম্পর্কে"}
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{description}</p>

                {isStatic && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      <Phone size={16} />
                      {language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
                    </Link>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageCircle size={16} />
                      {language === "en" ? "WhatsApp Us" : "হোয়াটসঅ্যাপ করুন"}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Medical Equipment picture grid */}
          {isMedicalEquipment && <MedicalEquipmentShowcase language={language} />}

          {!isStatic && <ServicePackageCards slug={slug} packages={packages} />}

        </div>
      </section>
    </>
  );
}
