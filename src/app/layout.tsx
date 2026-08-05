import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext";
import PublicLayout from "@/components/layout/PublicLayout";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nexivio Care – Trusted Home Healthcare Services",
    template: "%s | Nexivio Care",
  },
  description:
    "Nexivio Care provides professional nursing, caregiver, baby care, and elder care services across Bangladesh with trained and verified staff.",
  keywords: ["home healthcare", "caregiver", "nursing service", "elder care", "baby care", "Bangladesh"],
  openGraph: {
    siteName: "Nexivio Care",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexiviocare.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Nexivio Care",
    description: "Professional nursing, caregiver, baby care and elder care services across Bangladesh.",
    url: siteUrl,
    telephone: "+8801700938055",
    email: "nexiviocare@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    sameAs: [
      "https://facebook.com/nexiviocare",
      "https://youtube.com/@nexiviocare",
      "https://linkedin.com/company/nexiviocare",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SettingsProvider>
          <LanguageProvider>
            <PublicLayout>{children}</PublicLayout>
            <Toaster position="top-center" />
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
