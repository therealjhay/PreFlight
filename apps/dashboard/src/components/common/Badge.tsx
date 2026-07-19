interface BadgeProps {
  variant: "green" | "red" | "amber" | "default";
  children: string;
  className?: string;
}

const variants = {
  green: "bg-emerald-500/20 text-emerald-300",
  red: "bg-red-500/20 text-red-300",
  amber: "bg-amber-500/20 text-amber-300",
  default: "bg-white/10 text-white/60",
};

export function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
