import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Nexivio Care by phone, WhatsApp, email, or our contact form.",
};

export default function ContactPage() {
  return <ContactContent />;
}
