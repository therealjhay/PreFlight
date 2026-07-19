import type { RiskLevel } from "@preflight/types";
import { Badge } from "../common/Badge";

interface RiskBadgeProps {
  level: RiskLevel;
}

const badges: Record<RiskLevel, { text: string; variant: "green" | "red" | "amber" }> = {
  LOW: { text: "SAFE", variant: "green" },
  MEDIUM: { text: "CAUTION", variant: "amber" },
  HIGH: { text: "HIGH RISK", variant: "red" },
};

export function RiskBadge({ level }: RiskBadgeProps) {
  const { text, variant } = badges[level];
  return <Badge variant={variant}>{text}</Badge>;
}
