import type { Metadata } from "next";
import BookServiceContent from "./BookServiceContent";

export const metadata: Metadata = {
  title: "Book a Service",
  description: "Book a professional home healthcare service with Nexivio Care.",
};

export default function BookServicePage() {
  return <BookServiceContent />;
}
