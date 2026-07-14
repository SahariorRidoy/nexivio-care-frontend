"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function CompanyIntro() {
  const { t } = useLanguage();
  const intro = t.home.intro;

  return (
    <section className="bg-primary-50 py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="primary" className="mb-4">
            {intro.badge}
          </Badge>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl leading-snug">
            {intro.title}
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">{intro.description}</p>
          <Link href="/about" className="mt-6 inline-block">
            <Button size="lg">{t.common.learnMore}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
