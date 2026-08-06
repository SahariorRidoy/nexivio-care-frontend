import type { Metadata } from "next";
import TransportationPage from "./TransportationPage";

export const metadata: Metadata = {
  title: "Transportation Services | Nexivio Care",
  description: "Book ambulance, private car, microbus, SUV, pickup, truck and more transportation services.",
};

export default function Page() {
  return <TransportationPage />;
}
