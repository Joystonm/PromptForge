"use client";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded-md shimmer bg-white/5",
            i === lines - 1 && lines > 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  );
}
