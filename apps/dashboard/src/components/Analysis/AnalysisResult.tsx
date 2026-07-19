import type { AnalysisResponse } from "@preflight/types";
import { Card } from "../common/Card";
import { RiskBadge } from "./RiskBadge";
import { RiskScore } from "./RiskScore";
import { TransactionSummary } from "./TransactionSummary";
import { ReputationCard } from "./ReputationCard";
import { SimulationResultCard } from "./SimulationResultCard";
import { WarningList } from "./WarningList";
import { RecommendationCard } from "./RecommendationCard";

interface AnalysisResultProps {
  result: AnalysisResponse;
}

const glowMap = {
  LOW: "green" as const,
  MEDIUM: "amber" as const,
  HIGH: "red" as const,
};

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-4 animate-[slideUp_0.3s_ease-out]">
      <Card className="p-6" glow={glowMap[result.risk.level]}>
        <div className="flex items-start justify-between mb-6">
          <RiskScore score={result.risk.score} level={result.risk.level} />
          <RiskBadge level={result.risk.level} />
        </div>
        <p className="text-sm text-white/70">
          {result.risk.recommendation}
        </p>
      </Card>

      <TransactionSummary
        decoded={result.decoded}
        simulation={result.simulation}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReputationCard reputation={result.reputation} />
        <SimulationResultCard simulation={result.simulation} />
      </div>

      <WarningList reasons={result.risk.reasons} />

      <RecommendationCard
        level={result.risk.level}
        recommendation={result.risk.recommendation}
      />
    </div>
  );
}
