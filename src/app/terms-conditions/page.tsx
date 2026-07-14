import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Nexivio Care terms and conditions for using our services.",
};

const sections = [
  {
    title: "সেবা গ্রহণের শর্ত / Acceptance of Terms",
    content:
      "আমাদের ওয়েবসাইট বা সেবা ব্যবহার করে আপনি এই শর্তাবলি মেনে নিচ্ছেন বলে গণ্য হবে। By using our website or services, you agree to be bound by these terms and conditions.",
  },
  {
    title: "সেবার বিবরণ / Service Description",
    content:
      "Nexivio Care পেশাদার নার্সিং, কেয়ারগিভার, বেবি কেয়ার এবং এল্ডার কেয়ার সেবা প্রদান করে। সেবার মান ও প্রাপ্যতা পরিবর্তিত হতে পারে। Nexivio Care provides professional nursing, caregiver, baby care and elder care services. Service availability and quality may vary by location.",
  },
  {
    title: "বুকিং ও বাতিলকরণ / Booking & Cancellation",
    content:
      "বুকিং নিশ্চিত হওয়ার পর বাতিল করতে হলে কমপক্ষে ২৪ ঘণ্টা আগে আমাদের জানাতে হবে। Cancellations must be made at least 24 hours before the scheduled service. Late cancellations may incur a fee.",
  },
  {
    title: "পেমেন্ট / Payment",
    content:
      "সেবার মূল্য পরিশোধ bKash, Nagad, Rocket, কার্ড বা নগদে করা যাবে। মূল্য পরিবর্তনের অধিকার Nexivio Care সংরক্ষণ করে। Payment can be made via bKash, Nagad, Rocket, card or cash. Nexivio Care reserves the right to change pricing with prior notice.",
  },
  {
    title: "দায়বদ্ধতার সীমা / Limitation of Liability",
    content:
      "Nexivio Care সর্বোচ্চ মানের সেবা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ, তবে অপ্রত্যাশিত পরিস্থিতিতে সেবা বিঘ্নিত হলে আমরা দায়ী থাকব না। While we strive to provide the highest quality service, Nexivio Care shall not be liable for service disruptions caused by unforeseen circumstances.",
  },
  {
    title: "মেধাস্বত্ব / Intellectual Property",
    content:
      "এই ওয়েবসাইটের সকল কন্টেন্ট, লোগো এবং ডিজাইন Nexivio Care-এর মেধাস্বত্ব। All content, logos and designs on this website are the intellectual property of Nexivio Care and may not be reproduced without permission.",
  },
  {
    title: "পরিবর্তনের অধিকার / Changes to Terms",
    content:
      "Nexivio Care যেকোনো সময় এই শর্তাবলি পরিবর্তন করার অধিকার রাখে। পরিবর্তন এই পেজে প্রকাশিত হবে। Nexivio Care reserves the right to modify these terms at any time. Changes will be published on this page.",
  },
];

export default function TermsConditionsPage() {
  return (
    <>
      <PageHeader title="শর্তাবলি" subtitle="Terms & Conditions" />
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
