"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= value;
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={() => interactive && onChange?.(i + 1)}
            disabled={!interactive}
            className={cn(
              "disabled:cursor-default",
              interactive && "cursor-pointer hover:scale-110 transition-transform"
            )}
          >
            <Star
              size={size}
              className={filled ? "fill-amber-400 stroke-amber-400" : "stroke-slate-300"}
            />
          </button>
        );
      })}
    </div>
  );
}
