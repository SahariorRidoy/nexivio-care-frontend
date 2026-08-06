"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Car, DollarSign, MapPin, Shield } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const VEHICLE_OPTIONS = [
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
  ownerName: z.string().min(2, "Name required"),
  ownerPhone: z.string().min(11, "Valid phone required"),
  ownerEmail: z.string().email().optional().or(z.literal("")),
  ownerAddress: z.string().optional(),
  vehicleType: z.string().min(1, "Select vehicle type"),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  registrationNo: z.string().optional(),
  seatingCapacity: z.coerce.number().int().positive().optional(),
  acAvailable: z.boolean().optional(),
  driverIncluded: z.boolean().optional(),
  dailyRate: z.coerce.number().positive().optional(),
  perKmRate: z.coerce.number().positive().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function VehicleRegistrationContent() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { acAvailable: false, driverIncluded: true },
  });

  const onSubmit = async (data: FormData) => {
    await api.post("/vehicle-registrations", data);
    toast.success("Vehicle registration submitted! We will review and contact you.");
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Registration Submitted!</h2>
        <p className="text-slate-500 max-w-sm text-sm">
          Your vehicle registration is under review. Our team will contact you within 24 hours after approval.
        </p>
        <button onClick={() => setSubmitted(false)} className="mt-2 text-sm font-semibold text-primary-700 underline">
          Register another vehicle
        </button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Register Your Vehicle"
        subtitle="Join our transport network and start earning"
        bgImage="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80&auto=format&fit=crop"
      />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Benefits sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-4">Why Register?</p>
                <div className="space-y-4">
                  {[
                    { icon: DollarSign, title: "Earn More",       desc: "Get regular bookings from our platform" },
                    { icon: Shield,     title: "Verified Badge",  desc: "Build trust with a verified owner badge" },
                    { icon: Car,        title: "Easy Management", desc: "Manage bookings from one dashboard" },
                    { icon: MapPin,     title: "Wide Reach",      desc: "Reach customers across Dhaka & beyond" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-primary-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{title}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-amber-700 mb-2">📋 Review Process</p>
                <p className="text-xs text-amber-600">After submission, our admin team reviews your registration within 24 hours. You will be notified via phone upon approval.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full bg-primary-600" />
              <div className="p-8">
                <h2 className="text-lg font-bold mb-6 text-primary-800">Vehicle Registration Form</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                  {/* Owner Info */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Owner Information</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Owner Name" required error={errors.ownerName?.message} {...register("ownerName")} />
                      <Input label="Phone Number" type="tel" required error={errors.ownerPhone?.message} {...register("ownerPhone")} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Email (optional)" type="email" error={errors.ownerEmail?.message} {...register("ownerEmail")} />
                      <Input label="Address" error={errors.ownerAddress?.message} {...register("ownerAddress")} />
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="rounded-xl border border-green-100 bg-green-50/40 p-4 flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Vehicle Information</p>
                    <Select
                      label="Vehicle Type"
                      required
                      options={VEHICLE_OPTIONS}
                      placeholder="— Select Vehicle Type —"
                      error={errors.vehicleType?.message}
                      {...register("vehicleType")}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input label="Brand (e.g. Toyota)" error={errors.vehicleBrand?.message} {...register("vehicleBrand")} />
                      <Input label="Model (e.g. Hiace)" error={errors.vehicleModel?.message} {...register("vehicleModel")} />
                      <Input label="Year" error={errors.vehicleYear?.message} {...register("vehicleYear")} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Registration No." error={errors.registrationNo?.message} {...register("registrationNo")} />
                      <Input label="Seating Capacity" type="number" min={1} error={errors.seatingCapacity?.message} {...register("seatingCapacity")} />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" {...register("acAvailable")} className="w-4 h-4 rounded accent-primary-600" />
                        AC Available
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" {...register("driverIncluded")} className="w-4 h-4 rounded accent-primary-600" />
                        Driver Included
                      </label>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Daily Rate (৳)" type="number" min={0} error={errors.dailyRate?.message} {...register("dailyRate")} />
                    <Input label="Per KM Rate (৳)" type="number" min={0} error={errors.perKmRate?.message} {...register("perKmRate")} />
                  </div>

                  <Textarea label="Description / Additional Info" rows={3} {...register("description")} />

                  <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                    Submit Vehicle Registration
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
