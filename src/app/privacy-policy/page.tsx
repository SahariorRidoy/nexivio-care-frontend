import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Nexivio Care privacy policy — how we collect, use and protect your information.",
};

const sections = [
  {
    title: "তথ্য সংগ্রহ / Information We Collect",
    content:
      "আমরা আপনার নাম, ফোন নম্বর, ঠিকানা এবং সেবা সংক্রান্ত তথ্য সংগ্রহ করি যা আপনি স্বেচ্ছায় প্রদান করেন। We collect your name, phone number, address and service-related information that you voluntarily provide when booking a service or contacting us.",
  },
  {
    title: "তথ্য ব্যবহার / How We Use Your Information",
    content:
      "সংগৃহীত তথ্য শুধুমাত্র সেবা প্রদান, বুকিং নিশ্চিতকরণ এবং গ্রাহক সহায়তার জন্য ব্যবহার করা হয়। Your information is used solely to deliver services, confirm bookings, and provide customer support. We do not sell or share your data with third parties.",
  },
  {
    title: "তথ্য সুরক্ষা / Data Security",
    content:
      "আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে আমরা শিল্পমানের নিরাপত্তা ব্যবস্থা ব্যবহার করি। We use industry-standard security measures including encrypted connections and secure servers to protect your personal data.",
  },
  {
    title: "কুকিজ / Cookies",
    content:
      "আমাদের ওয়েবসাইট ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করতে পারে। Our website may use cookies to improve user experience. You can disable cookies in your browser settings at any time.",
  },
  {
    title: "তৃতীয় পক্ষ / Third-Party Services",
    content:
      "আমরা Cloudinary (ছবি সংরক্ষণ) এবং পেমেন্ট গেটওয়ে সেবা ব্যবহার করি যাদের নিজস্ব গোপনীয়তা নীতি রয়েছে। We use third-party services such as Cloudinary for image storage and payment gateways, each governed by their own privacy policies.",
  },
  {
    title: "যোগাযোগ / Contact Us",
    content:
      "গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন। For any questions regarding this privacy policy, please contact us via our Contact page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="গোপনীয়তা নীতি" subtitle="Privacy Policy" />
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-sm text-slate-500 mb-8">
            সর্বশেষ আপডেট / Last updated: January 2025
          </p>
          <div className="flex flex-col gap-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-base font-bold text-slate-800 mb-2">{s.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
