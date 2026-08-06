import { Suspense } from "react";
import type { Metadata } from "next";
import TransportBookingContent from "./TransportBookingContent";

export const metadata: Metadata = {
  title: "Book Transport | Nexivio Care",
  description: "Book ambulance, car, microbus, truck and other transport services.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TransportBookingContent />
    </Suspense>
  );
}
