import type { Metadata } from "next";
import JobApplicationContent from "./JobApplicationContent";

export const metadata: Metadata = {
  title: "Job Application",
  description: "Apply to join the Nexivio Care team as a professional caregiver or healthcare worker.",
};

export default function JobApplicationPage() {
  return <JobApplicationContent />;
}
