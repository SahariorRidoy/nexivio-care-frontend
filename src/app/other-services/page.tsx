import type { Metadata } from "next";
import OtherServicesContent from "./OtherServicesContent";

export const metadata: Metadata = {
  title: "অন্যান্য সেবা | Nexivio Care",
  description: "Nexivio Care-এর অন্যান্য বিশেষ সেবাসমূহ।",
};

export default function OtherServicesPage() {
  return <OtherServicesContent />;
}
