import { ethers } from "ethers";
import dotenv from "dotenv";
import type { ReputationData } from "@preflight/types";

dotenv.config();

const REGISTRY_ABI = [
  "function getReputation(address target) view returns (tuple(uint256 riskScore, string reason, bool flagged, uint256 updatedAt, address reporter))",
  "function isFlagged(address target) view returns (bool)",
  "function getRiskScore(address target) view returns (uint256)",
];

const REGISTRY_ADDRESS = process.env.REGISTRY_ADDRESS || "";
const RPC_URL = process.env.MONAD_RPC_URL || "https://testnet-rpc.monad.xyz";

let provider: ethers.JsonRpcProvider | null = null;
let contract: ethers.Contract | null = null;

function getContract(): ethers.Contract | null {
  if (contract) return contract;
  if (!REGISTRY_ADDRESS) return null;

  provider = new ethers.JsonRpcProvider(RPC_URL);
  contract = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider);
  return contract;
}

export async function queryReputation(
  address: string
): Promise<ReputationData> {
  const registry = getContract();

  if (!registry) {
    return { flagged: false, score: 0 };
  }

  try {
    const reputation = await registry.getReputation(address);

    return {
      flagged: reputation.flagged,
      score: Number(reputation.riskScore),
      reason: reputation.reason || undefined,
      updatedAt: Number(reputation.updatedAt),
    };
  } catch (error) {
    console.error("Failed to query reputation:", error);
    return { flagged: false, score: 0 };
  }
}
