export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type TransactionAction =
  | "APPROVAL"
  | "TRANSFER"
  | "TRANSFER_FROM"
  | "SET_APPROVAL_FOR_ALL"
  | "SWAP"
  | "UNKNOWN";

export interface AnalyzeRequest {
  chainId: number;
  from: string;
  to: string;
  value: string;
  data: string;
  userIntent?: string;
}

export interface DecodedTransaction {
  action: TransactionAction;
  description: string;
  spender?: string;
  recipient?: string;
  amount?: string;
  tokenAddress?: string;
  functionSignature?: string;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  reasons: string[];
  recommendation: string;
}

export interface SimulationResult {
  success: boolean;
  assetsSent: AssetMovement[];
  assetsReceived: AssetMovement[];
  approvals: ApprovalGrant[];
  warnings: string[];
  revertReason?: string;
}

export interface AssetMovement {
  token: string;
  symbol?: string;
  amount: string;
  from: string;
  to: string;
}

export interface ApprovalGrant {
  token: string;
  spender: string;
  amount: string;
  isUnlimited: boolean;
}

export interface ReputationData {
  flagged: boolean;
  score: number;
  reason?: string;
  updatedAt?: number;
}

export interface IntentVerification {
  intentMismatch: boolean;
  explanation: string;
  expectedAction?: string;
  actualAction?: string;
}

export interface AnalysisResponse {
  transaction: {
    chainId: number;
    from: string;
    to: string;
    value: string;
    data: string;
  };
  decoded: DecodedTransaction;
  simulation: SimulationResult;
  reputation: ReputationData;
  risk: RiskAssessment;
  intent?: IntentVerification;
  recommendation: string;
}
