import type { RiskLevel } from "@preflight/types";

interface RecommendationCardProps {
  level: RiskLevel;
  recommendation: string;
}

const styles: Record<
  RiskLevel,
  { bg: string; border: string; text: string }
> = {
  LOW: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  MEDIUM: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
  },
  HIGH: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
  },
};

export function RecommendationCard({
  level,
  recommendation,
}: RecommendationCardProps) {
  const style = styles[level];
  return (
    <div
      className={`rounded-2xl border p-5 ${style.bg} ${style.border}`}
    >
      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-2">
        RECOMMENDATION
      </div>
      <p className={`text-sm font-semibold ${style.text}`}>{recommendation}</p>
    </div>
  );
}
