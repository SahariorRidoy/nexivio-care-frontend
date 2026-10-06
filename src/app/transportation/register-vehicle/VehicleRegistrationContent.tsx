"use client";

import { useState, useRef } from "react";
import { CheckCircle, Car, DollarSign, MapPin, Shield, Upload, X } from "lucide-react";
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

export default function VehicleRegistrationContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nidPreview, setNidPreview] = useState<string | null>(null);
  const [nidFile, setNidFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nidInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNidFile(file);
    setNidPreview(URL.createObjectURL(file));
  };

  const removeNid = () => {
    setNidFile(null);
    setNidPreview(null);
    if (nidInputRef.current) nidInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      // checkboxes: FormData omits unchecked boxes, so set explicit values
      fd.set("acAvailable", form.querySelector<HTMLInputElement>('[name="acAvailable"]')?.checked ? "true" : "false");
      fd.set("driverIncluded", form.querySelector<HTMLInputElement>('[name="driverIncluded"]')?.checked ? "true" : "false");
      if (imageFile) fd.set("image", imageFile);
      if (nidFile) fd.set("nidImage", nidFile);
      await api.upload("/vehicle-registrations", fd);
      toast.success("Vehicle registration submitted! We will review and contact you.");
      form.reset();
      removeImage();
      removeNid();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Please try again.");
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Owner Info */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Owner Information</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Owner Name" name="ownerName" required />
                      <Input label="Phone Number" name="ownerPhone" type="tel" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Email (optional)" name="ownerEmail" type="email" />
                      <Input label="Address" name="ownerAddress" />
                    </div>
                    {/* NID Image Upload */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">NID Card Image <span className="text-red-500">*</span></label>
                      {nidPreview ? (
                        <div className="relative w-full rounded-xl overflow-hidden border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={nidPreview} alt="NID preview" className="w-full h-36 object-cover" />
                          <button type="button" onClick={removeNid} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/40 rounded-xl px-4 py-4 transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                            <Upload size={16} className="text-amber-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">Upload NID card image</span>
                            <span className="text-xs text-slate-400">JPG, PNG or WebP · Max 5 MB</span>
                          </div>
                          <input ref={nidInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleNidChange} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="rounded-xl border border-green-100 bg-green-50/40 p-4 flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Vehicle Information</p>
                    <Select
                      label="Vehicle Type"
                      name="vehicleType"
                      required
                      options={VEHICLE_OPTIONS}
                      placeholder="— Select Vehicle Type —"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input label="Brand (e.g. Toyota)" name="vehicleBrand" />
                      <Input label="Model (e.g. Hiace)" name="vehicleModel" />
                      <Input label="Year" name="vehicleYear" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Registration No." name="registrationNo" />
                      <Input label="Seating Capacity" name="seatingCapacity" type="number" min={1} />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" name="acAvailable" className="w-4 h-4 rounded accent-primary-600" />
                        AC Available
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" name="driverIncluded" defaultChecked className="w-4 h-4 rounded accent-primary-600" />
                        Driver Included
                      </label>
                    </div>
                  </div>

                  {/* Vehicle Image */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Vehicle Photo</label>
                    {imagePreview ? (
                      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Vehicle preview" className="w-full h-48 object-cover" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-xl px-4 py-5 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                          <Upload size={16} className="text-primary-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">Upload vehicle image</span>
                          <span className="text-xs text-slate-400">JPG, PNG or WebP · Max 5 MB</span>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>

                  <Textarea label="Description / Additional Info" name="description" rows={3} />

                  <Button type="submit" size="lg" fullWidth isLoading={submitting}>
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
