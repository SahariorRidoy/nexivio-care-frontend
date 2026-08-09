"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Megaphone, Briefcase, GraduationCap, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { cn, formatDate, assetUrl, downloadFile } from "@/lib/utils";
import type { Notice, NoticeType } from "@/types";

const filterKeys = ["all", "general", "training", "circular", "job"] as const;
type FilterKey = typeof filterKeys[number];

const TYPE_CONFIG: Record<NoticeType, {
  color: string;
  bg: string;
  border: string;
  icon: typeof FileText;
  labelEn: string;
  labelBn: string;
}> = {
  general:  { color: "#7c3aed", bg: "#f5f3ff", border: "#7c3aed", icon: Megaphone,      labelEn: "General",  labelBn: "সাধারণ"    },
  training: { color: "#1d4ed8", bg: "#eff6ff", border: "#1d4ed8", icon: GraduationCap,  labelEn: "Training", labelBn: "প্রশিক্ষণ" },
  circular: { color: "#c2410c", bg: "#fff7ed", border: "#c2410c", icon: RefreshCw,       labelEn: "Circular", labelBn: "সার্কুলার" },
  job:      { color: "#15803d", bg: "#f0fdf4", border: "#15803d", icon: Briefcase,       labelEn: "Job",      labelBn: "চাকরি"     },
};

const FILTER_ICONS: Record<FilterKey, typeof FileText> = {
  all:      FileText,
  general:  Megaphone,
  training: GraduationCap,
  circular: RefreshCw,
  job:      Briefcase,
};

const HEADER_IMAGE = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=85&auto=format&fit=crop";

export default function NoticeBoardContent() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState<FilterKey>("all");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const nb = t.noticeBoard;
  const isBn = language === "bn";

  useEffect(() => {
    api.get<{ data: Notice[] }>("/notices")
      .then((r) => setNotices(r.data.filter((n) => n.isActive)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "all" ? notices : notices.filter((n) => n.type === active);

  const counts = filterKeys.reduce((acc, key) => {
    acc[key] = key === "all" ? notices.length : notices.filter((n) => n.type === key).length;
    return acc;
  }, {} as Record<FilterKey, number>);

  return (
    <>
      <PageHeader title={nb.title} subtitle={nb.subtitle} bgImage={HEADER_IMAGE} />

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">

          {/* Filter tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {filterKeys.map((key) => {
              const Icon = FILTER_ICONS[key];
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold border transition-all",
                    isActive
                      ? "bg-[#0C2468] text-white border-[#0C2468]"
                      : "bg-white text-[#0C2468] border-[#0C2468] hover:bg-blue-50"
                  )}
                >
                  <Icon size={13} />
                  {nb.filters[key]}
                  {counts[key] > 0 && (
                    <span className={cn(
                      "ml-1 text-xs rounded-full px-1.5 py-0.5 font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {counts[key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notices */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-white border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <FileText size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm">{nb.noNotices}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((notice) => {
                const cfg = TYPE_CONFIG[notice.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={notice.id}
                    className="group flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md transition-shadow border-l-4"
                    style={{ borderLeftColor: cfg.border }}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                        <Icon size={18} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {isBn ? cfg.labelBn : cfg.labelEn}
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(notice.createdAt)}</span>
                        </div>
                        <p className="font-semibold text-slate-800 text-sm leading-snug">
                          {isBn ? notice.titleBn : notice.titleEn}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2">
                          {isBn ? notice.contentBn : notice.contentEn}
                        </p>
                      </div>
                    </div>
                    {notice.documentUrl && (
                      <button
                        onClick={() => downloadFile(assetUrl(notice.documentUrl!), `notice-${notice.id}.pdf`)}
                        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors"
                        style={{ color: "#0C2468", borderColor: "#0C2468" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0C2468";
                          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
                          (e.currentTarget as HTMLButtonElement).style.color = "#0C2468";
                        }}
                      >
                        <Download size={13} />
                        {nb.downloadDocument}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
