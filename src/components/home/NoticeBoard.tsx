"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { assetUrl } from "@/lib/utils";
import type { Notice } from "@/types";

const typeConfig: Record<string, { labelBn: string; labelEn: string; bg: string }> = {
  job:      { labelBn: "নতুন",   labelEn: "New",     bg: "bg-green-600" },
  training: { labelBn: "আপডেট", labelEn: "Update",  bg: "bg-orange-500" },
  circular: { labelBn: "জরুরি", labelEn: "Urgent",  bg: "bg-red-600" },
  general:  { labelBn: "নোটিস", labelEn: "Notice",  bg: "bg-primary-700" },
};

export default function NoticeBoard() {
  const { t, language } = useLanguage();
  const nb = t.home.noticeBoard;
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    api.get<{ data: Notice[] }>("/notices")
      .then((r) => setNotices(r.data.filter((n) => n.isActive).slice(0, 5)))
      .catch(() => {});
  }, []);

  const { intro } = t.home;

  if (notices.length === 0) return null;

  return (
    <section className="bg-white pt-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10">

          {/* Left — About Us */}
          <div className="lg:w-1/2 shrink-0 rounded-xl border border-gray-100 shadow-sm overflow-hidden self-start">
            <div className="bg-navy-900 px-5 py-3">
              <h2 className="text-white font-bold text-base">{t.about.title}</h2>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">{intro.description}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{t.about.profile.description}</p>
            </div>
            <div className="px-5 pb-5">
              <Link
                href="/about"
                className="inline-block bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                {t.common.learnMore}
              </Link>
            </div>
          </div>

          {/* Right — Notice Board */}
          <div className="flex-1 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between bg-primary-800 px-5 py-3">
              <h2 className="text-white font-bold text-base">{nb.title}</h2>
              <Link href="/notice-board" className="bg-white text-primary-800 hover:bg-primary-50 text-xs font-bold px-3 py-1 rounded-md transition-colors">
                {nb.viewAllNotices}
              </Link>
            </div>

            {/* Scrolling ticker */}
            <div className="flex items-center gap-3 overflow-hidden bg-primary-50 border-b border-primary-100 px-4 py-2">
              <Bell size={14} className="shrink-0 text-primary-600" />
              <div className="overflow-hidden whitespace-nowrap">
                <span className="inline-block animate-marquee text-xs text-primary-700 font-medium">
                  {notices.map((n) => (language === "en" ? n.titleEn : n.titleBn)).join(" • ")}
                </span>
              </div>
            </div>

            <div className="h-51.25 overflow-y-auto divide-y divide-gray-50">
              {notices.map((notice) => {
                const cfg = typeConfig[notice.type] ?? typeConfig.general;
                return (
                  <div key={notice.id} className="flex items-start gap-3 px-5 py-4">
                    <span className={`shrink-0 text-white text-xs font-bold px-2.5 py-0.5 rounded ${cfg.bg}`}>
                      {language === "en" ? cfg.labelEn : cfg.labelBn}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {language === "en" ? notice.titleEn : notice.titleBn}
                      </p>
                      {notice.documentUrl && (
                        <a href={assetUrl(notice.documentUrl)} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-1">
                          <FileText size={11} /> {nb.downloadDocument}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
