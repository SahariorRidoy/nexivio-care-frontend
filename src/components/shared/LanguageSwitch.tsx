"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitchProps {
  className?: string;
  dark?: boolean;
}

export default function LanguageSwitch({ className, dark = false }: LanguageSwitchProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "flex items-center rounded-full overflow-hidden border text-xs font-semibold select-none",
        dark ? "border-white/30" : "border-slate-300",
        className
      )}
    >
      <button
        onClick={() => setLanguage("bn")}
        className={cn(
          "px-3 py-1 transition-colors",
          language === "bn"
            ? "bg-primary-700 text-white"
            : dark
            ? "text-white/70 hover:text-white"
            : "text-slate-500 hover:text-slate-700"
        )}
        aria-label="Switch to Bengali"
      >
        বাং
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1 transition-colors",
          language === "en"
            ? "bg-primary-700 text-white"
            : dark
            ? "text-white/70 hover:text-white"
            : "text-slate-500 hover:text-slate-700"
        )}
        aria-label="Switch to English"
      >
        ENG
      </button>
    </div>
  );
}
