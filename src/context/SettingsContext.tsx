"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SITE_CONFIG } from "@/lib/constants";

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string | null;
  mapEmbedUrl: string | null;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  messengerUrl: string;
  logoUrl: string | null;
  qrImageUrl: string | null;
  missionEn: string | null;
  missionBn: string | null;
  visionEn: string | null;
  visionBn: string | null;
}

// Fallback to hardcoded constants if API is unavailable
const defaultSettings: SiteSettings = {
  phone: SITE_CONFIG.phone,
  whatsapp: SITE_CONFIG.whatsapp,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
  businessHours: null,
  mapEmbedUrl: null,
  facebookUrl: SITE_CONFIG.facebookUrl,
  youtubeUrl: SITE_CONFIG.youtubeUrl,
  linkedinUrl: SITE_CONFIG.linkedinUrl,
  instagramUrl: SITE_CONFIG.instagramUrl,
  messengerUrl: SITE_CONFIG.messengerUrl,
  logoUrl: null,
  qrImageUrl: null,
  missionEn: null,
  missionBn: null,
  visionEn: null,
  visionBn: null,
};

const SettingsContext = createContext<SiteSettings>(defaultSettings);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
    fetch(`${apiUrl}/settings`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) {
          setSettings((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(json.data).filter(([, v]) => v !== null && v !== "")
            ),
          }));
        }
      })
      .catch(() => {}); // silently fall back to defaults
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
