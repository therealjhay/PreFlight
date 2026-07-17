import { AnalyzeRequestSchema, type ValidatedAnalyzeRequest } from "./validation.js";

export { RISK_SCORES, RISK_THRESHOLDS, MONAD_TESTNET, MAX_UINT256 } from "./constants.js";

export function validateAnalyzeRequest(data: unknown): ValidatedAnalyzeRequest {
  return AnalyzeRequestSchema.parse(data);
}

export function isUnlimitedApproval(amount: string): boolean {
  const maxUint256 = BigInt(
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  );
  return BigInt(amount) >= maxUint256;
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount: string, decimals: number = 18): string {
  const bigAmount = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const whole = bigAmount / divisor;
  const fraction = bigAmount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, 4);
  return `${whole}.${fractionStr}`;
}
