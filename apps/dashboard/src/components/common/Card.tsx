import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: "green" | "red" | "amber" | "none";
}

const glowStyles = {
  green: "ring-1 ring-emerald-500/20",
  red: "ring-1 ring-red-500/20",
  amber: "ring-1 ring-amber-500/20",
  none: "",
};

export function Card({ children, className = "", glow = "none" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all duration-200 hover:border-white/[0.12] ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
}
