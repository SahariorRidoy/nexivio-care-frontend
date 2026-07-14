"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-8xl font-bold text-primary-200">404</p>
      <h1 className="text-3xl font-bold text-slate-900">{t.notFound.title}</h1>
      <p className="text-slate-500 max-w-sm">{t.notFound.description}</p>
      <Link href="/">
        <Button size="lg">{t.notFound.backHome}</Button>
      </Link>
    </div>
  );
}
