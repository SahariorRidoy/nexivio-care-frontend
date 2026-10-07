"use client";

import { useState, useRef } from "react";
import { CheckCircle, Car, DollarSign, MapPin, Shield, Upload, X, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import PageHeader from "@/components/shared/PageHeader";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const VEHICLE_OPTIONS = [
  { value: "ambulance",       label: "🚑 Ambulance" },
  { value: "private-car",     label: "🚗 Private Car" },
  { value: "noah-hiace",      label: "🚐 Noah & Hiace" },
  { value: "microbus",        label: "🚌 Microbus" },
  { value: "suv-jeep",        label: "🚙 SUV / Jeep" },
  { value: "pickup",          label: "🚚 Pickup" },
  { value: "truck",           label: "🚛 Truck" },
  { value: "covered-van",     label: "📦 Covered Van" },
];

interface VehicleEntry {
  id: number;
  imageFile: File | null;
  imagePreview: string | null;
}

function VehicleForm({
  index,
  entry,
  onImageChange,
  onRemoveImage,
  onRemove,
  showRemove,
}: {
  index: number;
  entry: VehicleEntry;
  onImageChange: (id: number, file: File) => void;
  onRemoveImage: (id: number) => void;
  onRemove: (id: number) => void;
  showRemove: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-green-100 bg-green-50/40 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          Vehicle {index + 1}
        </p>
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 size={13} /> Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-base font-bold text-nav-DEFAULT">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <select
            name={`vehicleType_${entry.id}`}
            required
            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="" disabled selected>— Select Vehicle Type —</option>
            {VEHICLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <Input label="Brand (e.g. Toyota)" name={`vehicleBrand_${entry.id}`} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Model (e.g. Hiace)" name={`vehicleModel_${entry.id}`} required />
        <Input label="Year"               name={`vehicleYear_${entry.id}`} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Registration No."  name={`registrationNo_${entry.id}`} required />
        <Input label="Seating Capacity"  name={`seatingCapacity_${entry.id}`} type="number" min={1} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Vehicle photo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-base font-bold text-nav-DEFAULT">Vehicle Photo <span className="text-red-500">*</span></label>
          {entry.imagePreview ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.imagePreview} alt="Vehicle" className="w-full h-[88px] object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(entry.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-nav-DEFAULT hover:border-nav-DEFAULT/70 rounded-xl px-4 py-4 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <Upload size={16} className="text-primary-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">Upload vehicle image</span>
                <span className="text-xs text-slate-400">JPG, PNG or WebP · Max 5 MB</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageChange(entry.id, f); }}
              />
            </label>
          )}
        </div>
        <Textarea label="Description / Additional Info" name={`description_${entry.id}`} rows={3} />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" name={`acAvailable_${entry.id}`} className="w-4 h-4 rounded accent-primary-600" />
          AC Available
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" name={`driverIncluded_${entry.id}`} defaultChecked className="w-4 h-4 rounded accent-primary-600" />
          Driver Included
        </label>
      </div>
    </div>
  );
}

export default function VehicleRegistrationContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nidPreview, setNidPreview] = useState<string | null>(null);
  const [nidFile, setNidFile] = useState<File | null>(null);
  const nidInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [vehicles, setVehicles] = useState<VehicleEntry[]>([{ id: 1, imageFile: null, imagePreview: null }]);
  const nextId = useRef(2);

  const addVehicle = () => {
    setVehicles((prev) => [...prev, { id: nextId.current++, imageFile: null, imagePreview: null }]);
  };

  const removeVehicle = (id: number) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const handleVehicleImage = (id: number, file: File) => {
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, imageFile: file, imagePreview: URL.createObjectURL(file) } : v));
  };

  const removeVehicleImage = (id: number) => {
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, imageFile: null, imagePreview: null } : v));
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
    const form = e.currentTarget;

    // Collect owner fields once
    const ownerName    = (form.elements.namedItem("ownerName")    as HTMLInputElement).value;
    const ownerPhone   = (form.elements.namedItem("ownerPhone")   as HTMLInputElement).value;
    const ownerAddress = (form.elements.namedItem("ownerAddress") as HTMLTextAreaElement).value;
    const ownerEmail   = (form.elements.namedItem("ownerEmail")   as HTMLInputElement).value;

    try {
      let successCount = 0;
      for (const v of vehicles) {
        const fd = new FormData();
        fd.set("ownerName",    ownerName);
        fd.set("ownerPhone",   ownerPhone);
        fd.set("ownerAddress", ownerAddress);
        if (ownerEmail) fd.set("ownerEmail", ownerEmail);
        if (nidFile) fd.set("nidImage", nidFile);

        fd.set("vehicleType",     (form.elements.namedItem(`vehicleType_${v.id}`)     as HTMLSelectElement).value);
        fd.set("vehicleBrand",    (form.elements.namedItem(`vehicleBrand_${v.id}`)    as HTMLInputElement).value);
        fd.set("vehicleModel",    (form.elements.namedItem(`vehicleModel_${v.id}`)    as HTMLInputElement).value);
        fd.set("vehicleYear",     (form.elements.namedItem(`vehicleYear_${v.id}`)     as HTMLInputElement).value);
        fd.set("registrationNo",  (form.elements.namedItem(`registrationNo_${v.id}`)  as HTMLInputElement).value);
        fd.set("seatingCapacity", (form.elements.namedItem(`seatingCapacity_${v.id}`) as HTMLInputElement).value);
        fd.set("acAvailable",     (form.elements.namedItem(`acAvailable_${v.id}`)     as HTMLInputElement)?.checked ? "true" : "false");
        fd.set("driverIncluded",  (form.elements.namedItem(`driverIncluded_${v.id}`)  as HTMLInputElement)?.checked ? "true" : "false");
        fd.set("description",     (form.elements.namedItem(`description_${v.id}`)     as HTMLTextAreaElement).value);
        if (v.imageFile) fd.set("image", v.imageFile);

        await api.upload("/vehicle-registrations", fd);
        successCount++;
      }

      toast.success(`${successCount} vehicle${successCount > 1 ? "s" : ""} registered successfully!`);
      form.reset();
      removeNid();
      setVehicles([{ id: nextId.current++, imageFile: null, imagePreview: null }]);
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
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-blue-700 mb-2">🚗 Multiple Vehicles?</p>
                <p className="text-xs text-blue-600">You can register multiple vehicles at once. Fill in your owner info once, then add each vehicle using the <strong>+ Add Another Vehicle</strong> button.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full bg-primary-600" />
              <div className="p-8">
                <h2 className="text-lg font-bold mb-6 text-primary-800">Vehicle Registration Form</h2>
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Owner Info */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 flex flex-col gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Owner Information</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Owner Name"   name="ownerName"  required />
                      <Input label="Phone Number" name="ownerPhone" type="tel" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                      <Textarea label="Address" name="ownerAddress" required rows={3} />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-base font-bold text-nav-DEFAULT">Owner NID Card Image <span className="text-red-500">*</span></label>
                        {nidPreview ? (
                          <div className="relative w-full rounded-xl overflow-hidden border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={nidPreview} alt="NID preview" className="w-full h-[88px] object-cover" />
                            <button type="button" onClick={removeNid} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-nav-DEFAULT hover:border-nav-DEFAULT/70 bg-amber-50/40 rounded-xl px-4 py-4 transition-colors">
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
                    <Input label="Email (optional)" name="ownerEmail" type="email" />
                  </div>

                  {/* Vehicle entries */}
                  {vehicles.map((v, i) => (
                    <VehicleForm
                      key={v.id}
                      index={i}
                      entry={v}
                      onImageChange={handleVehicleImage}
                      onRemoveImage={removeVehicleImage}
                      onRemove={removeVehicle}
                      showRemove={vehicles.length > 1}
                    />
                  ))}

                  {/* Add vehicle button */}
                  <button
                    type="button"
                    onClick={addVehicle}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-primary-300 hover:border-primary-500 text-primary-600 hover:text-primary-800 text-sm font-semibold transition-colors bg-primary-50/40 hover:bg-primary-50"
                  >
                    <Plus size={16} /> Add Another Vehicle
                  </button>

                  <Button type="submit" size="lg" fullWidth isLoading={submitting}>
                    Submit {vehicles.length > 1 ? `${vehicles.length} Vehicles` : "Vehicle"} Registration
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
