import type { Metadata } from "next";
import TrainingDetailContent from "./TrainingDetailContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexiviocare.com";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/training/${slug}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    const t = json?.data;
    if (!t) throw new Error();
    return {
      title: t.titleEn,
      description: t.descriptionEn ?? `${t.titleEn} training course by Nexivio Care`,
      openGraph: {
        title: `${t.titleEn} | Nexivio Care`,
        description: t.descriptionEn ?? "",
        images: t.image ? [{ url: t.image }] : [],
        url: `${BASE_URL}/training/${slug}`,
        type: "website",
      },
    };
  } catch {
    return { title: "Training Details | Nexivio Care" };
  }
}

export default function TrainingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <TrainingDetailContent params={params} />;
}
