import type { Metadata } from "next";
import TrainingContent from "./TrainingContent";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Join Nexivio Care's certified training programs – caregiver, nursing, baby care, elder care, and more.",
};

export default function TrainingPage() {
  return <TrainingContent />;
}
