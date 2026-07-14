import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export default function Spinner({ size = 24, className, label = "Loading..." }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)} role="status">
      <Loader2 size={size} className="animate-spin text-primary-600" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
