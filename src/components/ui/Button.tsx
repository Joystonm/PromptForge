"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, loading, variant = "primary", className, disabled, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "ghost" && "text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors",
        "flex items-center gap-2",
        className
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
