import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  bgImage?: string;
  bgColor?: string;
}

export default function PageHeader({ title, subtitle, className, bgImage, bgColor }: PageHeaderProps) {
  return (
    <section className={cn("relative h-52 sm:h-64 overflow-hidden", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundColor: bgColor ?? "#0C2468",
          ...(bgImage && { backgroundImage: `url(${bgImage})` }),
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%)" }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-blue-200 text-sm max-w-md">{subtitle}</p>}
        <div className="mt-4 h-0.5 w-12 rounded-full bg-primary-400 mx-auto" />
      </div>
    </section>
  );
}
