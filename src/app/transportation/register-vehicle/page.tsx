import type { Metadata } from "next";
import VehicleRegistrationContent from "./VehicleRegistrationContent";

export const metadata: Metadata = {
  title: "Register Your Vehicle | Nexivio Care Transportation",
  description: "Register your vehicle with Nexivio Care and earn by providing transport services.",
};

export default function Page() {
  return <VehicleRegistrationContent />;
}
