interface StatusDotProps {
  color: "green" | "red";
  label: string;
  animate?: boolean;
}

export function StatusDot({ color, label, animate = false }: StatusDotProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`w-2 h-2 rounded-full ${
          color === "green" ? "bg-emerald-400" : "bg-red-400"
        } ${animate ? "animate-pulse" : ""}`}
      />
      <span className="text-emerald-400/60 font-mono">{label}</span>
    </div>
  );
}
