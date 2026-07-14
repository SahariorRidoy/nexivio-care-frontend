import type { Metadata } from "next";
import NoticeBoardContent from "./NoticeBoardContent";

export const metadata: Metadata = {
  title: "Notice Board",
  description: "Latest notices, circulars, and training announcements from Nexivio Care.",
};

export default function NoticeBoardPage() {
  return <NoticeBoardContent />;
}
