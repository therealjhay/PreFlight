import { describe, it, expect } from "vitest";
import { calculateRisk } from "../services/riskEngine.js";
import type { DecodedTransaction, ReputationData } from "@preflight/types";

const cleanReputation: ReputationData = {
  flagged: false,
  score: 0,
};

const flaggedReputation: ReputationData = {
  flagged: true,
  score: 95,
  reason: "Known phishing contract",
};

describe("calculateRisk", () => {
  it("scores unlimited approval as HIGH risk", () => {
    const decoded: DecodedTransaction = {
      action: "APPROVAL",
      description: "Unlimited token approval",
      amount: "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    };

    const risk = calculateRisk(decoded, cleanReputation);

    expect(risk.level).toBe("HIGH");
    expect(risk.score).toBeGreaterThanOrEqual(70);
    expect(risk.reasons).toContain("Unlimited token approval detected");
  });

  it("scores transfer as MEDIUM risk", () => {
    const decoded: DecodedTransaction = {
      action: "TRANSFER",
      description: "Token transfer",
      amount: "1000000000000000000",
    };

    const risk = calculateRisk(decoded, cleanReputation);

    expect(risk.level).toBe("MEDIUM");
    expect(risk.reasons).toContain("Token transfer detected");
  });

  it("scores unknown action as LOW risk", () => {
    const decoded: DecodedTransaction = {
      action: "UNKNOWN",
      description: "Unrecognized",
    };

    const risk = calculateRisk(decoded, cleanReputation);

    expect(risk.level).toBe("LOW");
    expect(risk.reasons).toContain("Unknown transaction type");
  });

  it("adds HIGH risk for flagged contracts", () => {
    const decoded: DecodedTransaction = {
      action: "TRANSFER",
      description: "Token transfer",
      amount: "1000000000000000000",
    };

    const risk = calculateRisk(decoded, flaggedReputation);

    expect(risk.level).toBe("HIGH");
    expect(risk.score).toBeGreaterThanOrEqual(90);
    expect(risk.reasons).toContainEqual(
      expect.stringContaining("Contract flagged")
    );
  });

  it("scores SetApprovalForAll as HIGH risk", () => {
    const decoded: DecodedTransaction = {
      action: "SET_APPROVAL_FOR_ALL",
      description: "Granting full NFT collection control",
    };

    const risk = calculateRisk(decoded, cleanReputation);

    expect(risk.level).toBe("HIGH");
    expect(risk.reasons).toContain("SetApprovalForAll grants full NFT control");
  });
});
