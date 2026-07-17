import type {
  DecodedTransaction,
  RiskAssessment,
  ReputationData,
} from "@preflight/types";
import { RISK_SCORES, RISK_THRESHOLDS } from "@preflight/shared";

export function calculateRisk(
  decoded: DecodedTransaction,
  reputation: ReputationData
): RiskAssessment {
  let score = 0;
  const reasons: string[] = [];

  if (reputation.flagged) {
    score += RISK_SCORES.MALICIOUS_REGISTRY;
    reasons.push(
      `Contract flagged in registry (score: ${reputation.score})`
    );
    if (reputation.reason) {
      reasons.push(reputation.reason);
    }
  }

  switch (decoded.action) {
    case "APPROVAL":
      if (decoded.amount) {
        const maxUint256 = BigInt(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        );
        if (BigInt(decoded.amount) >= maxUint256) {
          score += RISK_SCORES.UNLIMITED_APPROVAL;
          reasons.push("Unlimited token approval detected");
        } else {
          score += RISK_SCORES.APPROVAL;
          reasons.push("Token approval detected");
        }
      }
      break;

    case "TRANSFER":
      score += RISK_SCORES.TRANSFER;
      reasons.push("Token transfer detected");
      break;

    case "TRANSFER_FROM":
      score += RISK_SCORES.APPROVAL;
      reasons.push("TransferFrom call detected (spending approved tokens)");
      break;

    case "SET_APPROVAL_FOR_ALL":
      score += RISK_SCORES.UNLIMITED_APPROVAL;
      reasons.push("SetApprovalForAll grants full NFT control");
      break;

    case "SWAP":
      score += RISK_SCORES.TRANSFER;
      reasons.push("Token swap detected");
      break;

    case "UNKNOWN":
      score += RISK_SCORES.UNKNOWN_ACTION;
      reasons.push("Unknown transaction type");
      break;
  }

  if (!reputation.flagged && decoded.action !== "UNKNOWN") {
    score += RISK_SCORES.UNKNOWN_CONTRACT;
    reasons.push("Contract not found in reputation database");
  }

  score = Math.min(score, 100);

  let level: RiskAssessment["level"] = "LOW";
  if (score >= RISK_THRESHOLDS.HIGH) {
    level = "HIGH";
  } else if (score >= RISK_THRESHOLDS.MEDIUM) {
    level = "MEDIUM";
  }

  const recommendation =
    level === "HIGH"
      ? "Reject this transaction"
      : level === "MEDIUM"
        ? "Review carefully before proceeding"
        : "Transaction appears safe";

  return { score, level, reasons, recommendation };
}
