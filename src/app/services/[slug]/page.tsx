import type { Metadata } from "next";
import ServiceDetailContent from "./ServiceDetailContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexiviocare.com";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/services/${slug}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    const s = json?.data;
    if (!s) throw new Error();
    return {
      title: s.nameEn,
      description: s.shortDescEn ?? s.descriptionEn ?? `Professional ${s.nameEn} by Nexivio Care`,
      openGraph: {
        title: `${s.nameEn} | Nexivio Care`,
        description: s.shortDescEn ?? "",
        images: s.image ? [{ url: s.image }] : [],
        url: `${BASE_URL}/services/${slug}`,
        type: "website",
      },
    };
  } catch {
    return { title: "Service Details | Nexivio Care" };
  }
}

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ServiceDetailContent params={params} />;
}
