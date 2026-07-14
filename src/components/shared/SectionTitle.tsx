import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = true,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(centered ? "text-center" : "text-left", "mb-10", className)}>
      <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: "#0C2468" }}>{title}</h2>
      {subtitle && (
        <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-base">{subtitle}</p>
      )}
      <div className={cn("mt-4 h-1 w-12 rounded-full bg-primary-500", centered ? "mx-auto" : "")} />
    </div>
  );
}
