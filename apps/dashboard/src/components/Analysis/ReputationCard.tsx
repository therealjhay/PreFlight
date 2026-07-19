import type { ReputationData } from "@preflight/types";
import { Card } from "../common/Card";

interface ReputationCardProps {
  reputation: ReputationData;
}

export function ReputationCard({ reputation }: ReputationCardProps) {
  return (
    <Card className="p-5">
      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">
        CONTRACT REPUTATION
      </div>
      {reputation.flagged ? (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 font-semibold text-sm">FLAGGED</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-semibold text-sm">CLEAN</span>
        </div>
      )}
      {reputation.reason && (
        <p className="text-xs text-white/40 mt-2">{reputation.reason}</p>
      )}
      {reputation.score > 0 && (
        <p className="text-xs text-white/30 mt-1">
          Registry score: {reputation.score}/100
        </p>
      )}
    </Card>
  );
}
