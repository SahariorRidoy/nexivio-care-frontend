"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Phone } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

// ─── Category → vehicles mapping (mirrors Header.tsx) ────────────────────────
const CATEGORY_MAP: Record<string, { label: string; vehicles: string[] }> = {
  "local-transport":      { label: "🏙️ Local Transport",       vehicles: ["private-car", "noah-hiace", "microbus", "suv-jeep"] },
  "intercity-transport":  { label: "🛣️ Intercity Transport",   vehicles: ["private-car", "noah-hiace", "microbus", "suv-jeep"] },
  "corporate-transport":  { label: "🏢 Corporate Transport",   vehicles: ["private-car", "suv-jeep", "microbus", "noah-hiace"] },
  "airport-transfer":     { label: "✈️ Airport Transfer",      vehicles: ["private-car", "suv-jeep", "rent-a-car", "microbus"] },
  "ambulance-service":    { label: "🚑 Ambulance Service",     vehicles: ["ambulance"] },
  "goods-transportation": { label: "📦 Goods Transportation",  vehicles: ["pickup", "truck", "covered-van"] },
  "vehicle-rental":       { label: "🚖 Vehicle Rental",        vehicles: ["private-car", "rent-a-car", "suv-jeep", "noah-hiace"] },
};

const ALL_VEHICLES = [
  { value: "ambulance",       label: "🚑 Ambulance" },
  { value: "private-car",     label: "🚗 Private Car" },
  { value: "noah-hiace",      label: "🚐 Noah & Hiace" },
  { value: "microbus",        label: "🚌 Microbus" },
  { value: "suv-jeep",        label: "🚙 SUV / Jeep" },
  { value: "rent-a-car",      label: "🚖 Rent-a-Car" },
  { value: "pickup",          label: "🚚 Pickup" },
  { value: "truck",           label: "🚛 Truck" },
  { value: "covered-van",     label: "📦 Covered Van" },
  { value: "goods-transport", label: "📦 Goods Transportation" },
  { value: "intercity",       label: "🛣️ Intercity Transport" },
];

const schema = z.object({
  passengerName: z.string().min(2, "Name required"),
  passengerPhone: z.string().min(11, "Valid phone required"),
  passengerEmail: z.string().email().optional().or(z.literal("")),
  pickupAddress: z.string().min(3, "Pickup address required"),
  dropAddress: z.string().min(3, "Drop address required"),
  vehicleType: z.string().min(1, "Select vehicle type"),
  serviceCategory: z.string().optional(),
  tripType: z.enum(["one-way", "round-trip"]),
  scheduledDate: z.string().min(1, "Date required"),
  scheduledTime: z.string().min(1, "Time required"),
  passengerCount: z.coerce.number().int().positive().default(1),
  luggageCount: z.coerce.number().int().min(0).default(0),
  specialRequirements: z.string().optional(),
  paymentMethod: z.enum(["bkash", "cash", "card"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function TransportBookingContent() {
  const s = useSettings();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tripType: "one-way", passengerCount: 1, luggageCount: 0, paymentMethod: "cash" },
  });

  const selectedVehicle = watch("vehicleType");

  // Derive filtered vehicle list based on active category
  const vehicleOptions = activeCategory && CATEGORY_MAP[activeCategory]
    ? ALL_VEHICLES.filter((v) => CATEGORY_MAP[activeCategory].vehicles.includes(v.value))
    : ALL_VEHICLES;

  // On URL params change: set category + vehicle type
  useEffect(() => {
    const cat = searchParams.get("cat");
    const type = searchParams.get("type");

    if (cat && CATEGORY_MAP[cat]) {
      setActiveCategory(cat);
      setValue("serviceCategory", cat);
      // Auto-select first vehicle of this category if no type param
      if (!type) {
        const firstVehicle = CATEGORY_MAP[cat].vehicles[0];
        if (firstVehicle) setValue("vehicleType", firstVehicle, { shouldValidate: true });
      }
    }

    if (type) {
      setValue("vehicleType", type, { shouldValidate: true });
      // If no cat param, try to infer category from vehicle type
      if (!cat) {
        const inferred = Object.entries(CATEGORY_MAP).find(([, v]) => v.vehicles.includes(type));
        if (inferred) {
          setActiveCategory(inferred[0]);
          setValue("serviceCategory", inferred[0]);
        }
      }
    }

    setValue("paymentMethod", "cash");
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormData) => {
    await api.post("/transport-bookings", data);
    toast.success("Transport booking submitted successfully!");
    reset();
    setSelectedPayment("cash");
    setActiveCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Booking Submitted!</h2>
        <p className="text-slate-500 max-w-sm text-sm">We will confirm your transport booking shortly. Our team will call you.</p>
        <button onClick={() => setSubmitted(false)} className="mt-2 text-sm font-semibold text-primary-700 underline">
          Make another booking
        </button>
      </div>
    );
  }

  const catInfo = activeCategory ? CATEGORY_MAP[activeCategory] : null;

  return (
    <>
      <PageHeader
        title={catInfo ? catInfo.label : "Book Transport"}
        subtitle="Fill in the details and we will confirm your booking"
        bgImage="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format&fit=crop"
      />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Active category badge */}
              {catInfo && (
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-1">Selected Service</p>
                  <p className="text-base font-bold text-primary-800">{catInfo.label}</p>
                  <p className="text-xs text-primary-500 mt-1">
                    {catInfo.vehicles.length} vehicle type{catInfo.vehicles.length > 1 ? "s" : ""} available
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-br from-primary-700 to-primary-500 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-base mb-1">Need Help?</h3>
                <p className="text-primary-100 text-sm mb-4">Call us for instant booking assistance.</p>
                <a href={`tel:${s.phone}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg text-sm font-semibold">
                  <Phone size={14} /> {s.phone}
                </a>
              </div>

              {/* Category switcher */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">Service Categories</p>
                <div className="space-y-1">
                  {Object.entries(CATEGORY_MAP).map(([slug, cat]) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => {
                        setActiveCategory(slug);
                        setValue("serviceCategory", slug);
                        // Auto-select first vehicle of this category
                        const first = cat.vehicles[0];
                        if (first) setValue("vehicleType", first, { shouldValidate: true });
                      }}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === slug
                          ? "bg-primary-600 text-white font-semibold"
                          : "text-slate-600 hover:text-primary-700 hover:bg-primary-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                  {activeCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(null);
                        setValue("serviceCategory", undefined);
                        setValue("vehicleType", "", { shouldValidate: false });
                      }}
                      className="w-full text-left text-xs px-3 py-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      ✕ Clear filter
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full bg-primary-600" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-primary-800">Transport Booking Form</h2>
                  {catInfo && (
                    <span className="text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 rounded-full">
                      {catInfo.label}
                    </span>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <input type="hidden" {...register("serviceCategory")} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Full Name" required error={errors.passengerName?.message} {...register("passengerName")} />
                    <Input label="Phone Number" type="tel" required error={errors.passengerPhone?.message} {...register("passengerPhone")} />
                  </div>

                  <Input label="Email (optional)" type="email" error={errors.passengerEmail?.message} {...register("passengerEmail")} />

                  {/* Vehicle type — filtered by category */}
                  <div className="flex flex-col gap-1.5">
                    <Select
                      label="Vehicle Type"
                      required
                      options={vehicleOptions}
                      placeholder="— Select Vehicle —"
                      error={errors.vehicleType?.message}
                      {...register("vehicleType")}
                    />
                    {catInfo && vehicleOptions.length < ALL_VEHICLES.length && (
                      <p className="text-xs text-primary-600">
                        Showing {vehicleOptions.length} vehicle{vehicleOptions.length > 1 ? "s" : ""} for <strong>{catInfo.label}</strong>
                      </p>
                    )}
                  </div>

                  {/* Vehicle type quick-select pills */}
                  {vehicleOptions.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {vehicleOptions.map((v) => (
                        <button
                          key={v.value}
                          type="button"
                          onClick={() => setValue("vehicleType", v.value, { shouldValidate: true })}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                            selectedVehicle === v.value
                              ? "bg-primary-600 text-white border-primary-600"
                              : "bg-white text-slate-600 border-slate-200 hover:border-primary-400 hover:text-primary-700"
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Pickup Address" required error={errors.pickupAddress?.message} {...register("pickupAddress")} />
                    <Input label="Drop Address" required error={errors.dropAddress?.message} {...register("dropAddress")} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Select
                      label="Trip Type"
                      required
                      options={[
                        { value: "one-way", label: "One Way" },
                        { value: "round-trip", label: "Round Trip" },
                      ]}
                      error={errors.tripType?.message}
                      {...register("tripType")}
                    />
                    <Input label="Date" type="date" required error={errors.scheduledDate?.message} {...register("scheduledDate")} />
                    <Input label="Time" type="time" required error={errors.scheduledTime?.message} {...register("scheduledTime")} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <Input label="Passengers" type="number" min={1} error={errors.passengerCount?.message} {...register("passengerCount")} />
                    <Input label="Luggage Bags" type="number" min={0} error={errors.luggageCount?.message} {...register("luggageCount")} />
                  </div>

                  <Textarea label="Special Requirements (optional)" rows={2} {...register("specialRequirements")} />

                  {/* Payment */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Payment Method <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "cash",  label: "💵 Cash",  color: "#15803d" },
                        { value: "bkash", label: "📱 bKash", color: "#e2136e" },
                        { value: "card",  label: "💳 Card",  color: "#1d4ed8" },
                      ].map(({ value, label, color }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setSelectedPayment(value);
                            setValue("paymentMethod", value as FormData["paymentMethod"], { shouldValidate: true });
                          }}
                          className="py-3 rounded-xl border-2 text-xs font-semibold transition-all"
                          style={selectedPayment === value
                            ? { borderColor: color, backgroundColor: `${color}15`, color }
                            : { borderColor: "#e2e8f0", backgroundColor: "#fff", color: "#64748b" }
                          }
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>}
                    <input type="hidden" {...register("paymentMethod")} />
                  </div>

                  <Textarea label="Additional Notes (optional)" rows={2} {...register("notes")} />

                  <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                    Confirm Transport Booking
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
