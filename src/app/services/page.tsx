import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore Nexivio Care's full range of home healthcare services – nursing, caregiver, baby care, and elder care.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
