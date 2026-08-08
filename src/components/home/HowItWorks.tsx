"use client";

import { useLanguage } from "@/context/LanguageContext";
import SectionTitle from "@/components/shared/SectionTitle";
import { cn } from "@/lib/utils";

const stepKeys = ["step1", "step2", "step3", "step4"] as const;
const stepColors = [
  "bg-primary-600",
  "bg-accent-600",
  "bg-purple-600",
  "bg-orange-500",
];

export default function HowItWorks() {
  const { t } = useLanguage();
  const how = t.home.howItWorks;

  return (
    <section className="bg-primary-950 py-16 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionTitle
          title={how.title}
          subtitle={how.subtitle}
          className="[&_h2]:text-white [&_p]:text-primary-200 [&>div]:bg-primary-500"
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key, i) => {
            const step = how.steps[key];
            return (
              <div key={key} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < stepKeys.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden h-px w-full translate-x-4 bg-white/20 lg:block" />
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white",
                    stepColors[i]
                  )}
                >
                  {step.number}
                </div>
                <h3 className="mt-4 text-base sm:text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-primary-200 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
