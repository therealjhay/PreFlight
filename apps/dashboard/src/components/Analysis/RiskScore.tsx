import type { RiskLevel } from "@preflight/types";

interface RiskScoreProps {
  score: number;
  level: RiskLevel;
}

const colors: Record<RiskLevel, string> = {
  LOW: "text-emerald-400",
  MEDIUM: "text-amber-400",
  HIGH: "text-red-400",
};

const barColors: Record<RiskLevel, string> = {
  LOW: "bg-emerald-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-red-400",
};

export function RiskScore({ score, level }: RiskScoreProps) {
  return (
    <div>
      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-1">
        RISK SCORE
      </div>
      <div className={`text-5xl font-black tracking-tight ${colors[level]}`}>
        {score}
        <span className="text-2xl text-white/20 font-normal">/100</span>
      </div>
      <div className="mt-4 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColors[level]}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
