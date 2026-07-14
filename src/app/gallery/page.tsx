import type { Metadata } from "next";
import GalleryContent from "./GalleryContent";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos, videos, and event highlights from Nexivio Care.",
};

export default function GalleryPage() {
  return <GalleryContent />;
}
