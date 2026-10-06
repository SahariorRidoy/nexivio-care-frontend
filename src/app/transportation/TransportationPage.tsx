"use client";

import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import { Car, Truck, Bus, Ambulance, Package, MapPin, Clock, Shield, Phone } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const VEHICLE_TYPES = [
  { slug: "ambulance",        emoji: "🚑", label: "Ambulance Service",    labelBn: "অ্যাম্বুলেন্স সেবা",    desc: "24/7 emergency & non-emergency ambulance",       color: "bg-red-50 border-red-200 hover:border-red-400" },
  { slug: "private-car",      emoji: "🚗", label: "Private Car",          labelBn: "প্রাইভেট কার",           desc: "Comfortable AC/non-AC private car hire",         color: "bg-blue-50 border-blue-200 hover:border-blue-400" },
  { slug: "noah-hiace",       emoji: "🚐", label: "Noah & Hiace",         labelBn: "নোয়া ও হায়েস",          desc: "Family & group travel in Noah/Hiace",            color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400" },
  { slug: "microbus",         emoji: "🚌", label: "Microbus",             labelBn: "মাইক্রোবাস",             desc: "Spacious microbus for groups & events",          color: "bg-purple-50 border-purple-200 hover:border-purple-400" },
  { slug: "suv-jeep",         emoji: "🚙", label: "SUV / Jeep",           labelBn: "এসইউভি / জিপ",           desc: "Off-road & premium SUV/Jeep rental",             color: "bg-green-50 border-green-200 hover:border-green-400" },
  { slug: "rent-a-car",       emoji: "🚖", label: "Rent-a-Car",           labelBn: "রেন্ট-এ-কার",            desc: "Daily, weekly & monthly car rental",             color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400" },
  { slug: "pickup",           emoji: "🚚", label: "Pickup",               labelBn: "পিকআপ",                  desc: "Light goods & furniture pickup truck",           color: "bg-orange-50 border-orange-200 hover:border-orange-400" },
  { slug: "truck",            emoji: "🚛", label: "Truck",                labelBn: "ট্রাক",                  desc: "Heavy goods & commercial truck hire",            color: "bg-slate-50 border-slate-200 hover:border-slate-400" },
  { slug: "covered-van",      emoji: "📦", label: "Covered Van",          labelBn: "কভার্ড ভ্যান",           desc: "Secure covered van for goods transport",         color: "bg-teal-50 border-teal-200 hover:border-teal-400" },
  { slug: "goods-transport",  emoji: "📦", label: "Goods Transportation", labelBn: "পণ্য পরিবহন",            desc: "Full goods logistics & delivery service",        color: "bg-cyan-50 border-cyan-200 hover:border-cyan-400" },
  { slug: "intercity",        emoji: "🛣️", label: "Intercity Transport",  labelBn: "আন্তঃনগর পরিবহন",       desc: "Long-distance intercity travel & cargo",         color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400" },
];

const CATEGORIES = [
  { label: "Local Transport",     labelBn: "স্থানীয় পরিবহন",     icon: MapPin,      desc: "Within city transport for all needs" },
  { label: "Intercity Transport", labelBn: "আন্তঃনগর পরিবহন",    icon: Car,         desc: "Comfortable long-distance travel" },
  { label: "Corporate Transport", labelBn: "কর্পোরেট পরিবহন",    icon: Shield,      desc: "Dedicated fleet for businesses" },
  { label: "Airport Transfer",    labelBn: "এয়ারপোর্ট ট্রান্সফার", icon: Clock,      desc: "Timely airport pickup & drop" },
  { label: "Ambulance Service",   labelBn: "অ্যাম্বুলেন্স সেবা",  icon: Ambulance,   desc: "Emergency & non-emergency ambulance" },
  { label: "Goods Transportation",labelBn: "পণ্য পরিবহন",         icon: Package,     desc: "Safe & reliable goods delivery" },
  { label: "Vehicle Rental",      labelBn: "গাড়ি ভাড়া",          icon: Truck,       desc: "Daily, weekly & monthly rentals" },
];

export default function TransportationPage() {
  const s = useSettings();

  return (
    <>
      <PageHeader
        title="🚐 Transportation Services"
        subtitle="Reliable, safe & affordable transport for every need"
        bgImage="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format&fit=crop"
      />

      {/* ── Quick Action Buttons ── */}
      <div className="bg-white border-b border-slate-100 py-4 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/transportation/book"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-base shadow-md hover:shadow-lg transition-all"
          >
            🚐 Book Transport Now
          </Link>
          <Link
            href="/transportation/register-vehicle"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-base shadow-md hover:shadow-lg transition-all"
          >
            🚗 Register Your Vehicle
          </Link>
        </div>
      </div>

      {/* Categories */}
      <section className="bg-white py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Our Transport Categories</h2>
            <p className="text-slate-500 mt-2 text-sm">Choose the service that fits your need</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.label} className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                  <cat.icon size={22} className="text-primary-700" />
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">{cat.label}</p>
                <p className="text-[10px] text-slate-400 mt-1 hidden sm:block">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="bg-slate-50 py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Available Vehicles</h2>
            <p className="text-slate-500 mt-2 text-sm">Select a vehicle type to book your ride</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {VEHICLE_TYPES.map((v) => (
              <div key={v.slug} className={`rounded-2xl border-2 p-5 transition-all cursor-pointer ${v.color}`}>
                <div className="text-4xl mb-3">{v.emoji}</div>
                <h3 className="font-bold text-slate-800 text-base">{v.label}</h3>
                <p className="text-slate-500 text-xs mt-1 mb-4">{v.desc}</p>
                <Link
                  href={`/transportation/book?type=${v.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 bg-white border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all"
                >
                  Book Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose + CTA */}
      <section className="bg-white py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Our Transport?</h2>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: "Verified Drivers", desc: "All drivers are background-checked and licensed" },
                  { icon: Clock,  title: "On-Time Guarantee", desc: "We value your time — always punctual" },
                  { icon: Phone,  title: "24/7 Availability", desc: "Book anytime, day or night" },
                  { icon: MapPin, title: "Wide Coverage", desc: "Dhaka city & all major intercity routes" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-700 to-primary-500 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Ready to Book?</h3>
              <p className="text-primary-100 text-sm mb-6">Book your transport now or call us directly for instant assistance.</p>
              <div className="flex flex-col gap-3">
                <Link href="/transportation/book" className="block text-center bg-white text-primary-700 font-bold py-3 rounded-xl hover:bg-primary-50 transition-colors">
                  Book Transport Now
                </Link>
                <a href={`tel:${s.phone}`} className="block text-center border border-white/40 text-white font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors">
                  📞 Call: {s.phone}
                </a>
                <Link href="/transportation/register-vehicle" className="block text-center border border-white/40 text-white/80 font-medium py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
                  🚗 Register Your Vehicle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
