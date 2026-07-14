import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Nexivio Care – our mission, vision, team, and commitment to quality home healthcare.",
};

export default function AboutPage() {
  return <AboutContent />;
}
