type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export function calculateRisk(decoded: any) {
  let score = 0;
  const reasons: string[] = [];

  if (decoded.action === "APPROVAL") {
    const amount = BigInt(decoded.amount);

    if (amount > BigInt("1000000000000000000000")) {
      score += 90;

      reasons.push("Unlimited or very large token approval");
    } else {
      score += 40;
    }

    reasons.push("Token approval detected");
  }

  if (decoded.action === "TRANSFER") {
    score += 20;

    reasons.push("Token transfer detected");
  }

  if (decoded.action === "UNKNOWN") {
    score += 10;

    reasons.push("Unknown transaction");
  }

  let level: RiskLevel = "LOW";

  if (score >= 70) {
    level = "HIGH";
  } else if (score >= 40) {
    level = "MEDIUM";
  }

  return {
    score,
    level,
    reasons,
    recommendation:
      level === "HIGH" ? "Reject transaction" : "Transaction appears safe",
  };
}
