import type { Metadata } from "next";
import ReviewsContent from "./ReviewsContent";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read customer reviews and share your experience with Nexivio Care.",
};

export default function ReviewsPage() {
  return <ReviewsContent />;
}
